import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// Type definitions for transaction data
interface Transaction {
  date: string;
  transaction_id: string;
  name: string;
  type: string;
  amount: number;
}

interface TransactionError {
  error: string;
}

type TransactionData = Transaction[] | TransactionError[];

// Helper function to safely parse date
function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  // If invalid date, use current date as fallback
  return isNaN(date.getTime()) ? new Date() : date;
}

// Helper function to get current user ID from Prisma database
async function getCurrentUserId(): Promise<number | null> {
  let supabaseClient;
  let retryCount = 0;
  const maxRetries = 3;
  
  while (retryCount < maxRetries) {
    try {
      supabaseClient = await createClient();
      const { data: { user }, error } = await supabaseClient.auth.getUser();
      
      if (error || !user) {
        console.error('Error getting current user:', error);
        return null;
      }

      // Use findUnique first, then create if needed to avoid prepared statement conflicts
      let prismaUser = await prisma.user.findUnique({
        where: { email: user.email! }
      });

      if (!prismaUser) {
        // User doesn't exist, create new one
        try {
          prismaUser = await prisma.user.create({
            data: {
              name: user.user_metadata?.full_name || user.email!.split('@')[0],
              email: user.email!,
            }
          });
        } catch (createError: any) {
          // Handle race condition where user was created between findUnique and create
          if (createError?.code === 'P2002') { // Unique constraint violation
            prismaUser = await prisma.user.findUnique({
              where: { email: user.email! }
            });
          } else {
            throw createError;
          }
        }
      } else {
        // User exists, update name if needed
        const newName = user.user_metadata?.full_name || user.email!.split('@')[0];
        if (prismaUser.name !== newName) {
          prismaUser = await prisma.user.update({
            where: { email: user.email! },
            data: { name: newName }
          });
        }
      }

      return prismaUser?.id || null;
    } catch (error: any) {
      console.error(`Attempt ${retryCount + 1} - Error getting current user ID:`, error);
      
      // Check for prepared statement error
      if (error.message?.includes('prepared statement') || error.code === '42P05') {
        retryCount++;
        
        if (retryCount < maxRetries) {
          console.log(`Retrying after prepared statement error (attempt ${retryCount}/${maxRetries})...`);
          
          // Wait a bit before retry and try to reset connection
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          
          try {
            await prisma.$disconnect();
          } catch (disconnectError) {
            console.warn('Error during disconnect:', disconnectError);
          }
          
          continue;
        }
      }
      
      // If not a prepared statement error or max retries reached, return null
      return null;
    }
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { transactions } = await request.json();

    // Get current user ID with retry logic
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "User not authenticated" 
        },
        { status: 401 }
      );
    }

    // Validate that transactions is an array
    if (!Array.isArray(transactions)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid transaction data format. Expected an array." 
        },
        { status: 400 }
      );
    }

    // Check if the first item contains an error (from BAML prompt)
    if (transactions.length > 0 && 'error' in transactions[0]) {
      const errorData = transactions[0] as TransactionError;
      console.log("Transaction extraction error:", errorData.error);
      
      return NextResponse.json({
        success: false,
        error: errorData.error,
        message: `❌ **Upload Failed**\n\n${errorData.error}`
      }, { status: 400 });
    }

    // Validate that all items are valid transactions
    const validTransactions = transactions.filter((txn: any) => {
      return txn && 
             typeof txn.date === 'string' &&
             typeof txn.transaction_id === 'string' &&
             typeof txn.name === 'string' &&
             typeof txn.type === 'string' &&
             typeof txn.amount === 'number' &&
             !isNaN(parseDate(txn.date).getTime()); // Ensure date is parseable
    });

    if (validTransactions.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No valid transactions found in the uploaded file",
        message: "❌ **No Valid Transactions**\n\nNo valid transaction data could be extracted from the uploaded file."
      }, { status: 400 });
    }

    if (validTransactions.length !== transactions.length) {
      console.warn(`Filtered out ${transactions.length - validTransactions.length} invalid transactions`);
    }

    console.log(
      "Saving bulk transactions to database:",
      validTransactions.length,
      "valid transactions"
    );

    // Prepare transaction data outside of the Prisma transaction for better performance
    const transactionDataArray = validTransactions.map((bamlTxn: Transaction) => ({
      userId: currentUserId,
      accountId: 1, // Hardcoded as requested
      categoryId: 1, // Hardcoded as requested
      amount: Math.round(bamlTxn.amount * 100) / 100, // Round to 2 decimal places
      transactionType: bamlTxn.type.toLowerCase() === 'credit' ? 'INCOME' : 'EXPENSE',
      description: bamlTxn.name.trim(), // Trim whitespace
      referenceId: bamlTxn.transaction_id.trim(),
      createdAt: parseDate(bamlTxn.date),
    }));

    // Use createMany for better performance with bulk inserts
    let savedTransactions;
    try {
      // Use createMany for bulk insert (more efficient)
      const createResult = await prisma.transaction.createMany({
        data: transactionDataArray,
        skipDuplicates: true, // Skip any duplicates based on unique constraints
      });

      // Get the created transactions to return their IDs
      savedTransactions = await prisma.transaction.findMany({
        where: {
          userId: currentUserId,
          referenceId: {
            in: transactionDataArray.map(txn => txn.referenceId)
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: createResult.count
      });

    } catch (bulkError: any) {
      console.warn('Bulk insert failed, falling back to individual inserts:', bulkError.message);
      
      // Fallback to individual inserts if bulk insert fails
      savedTransactions = [];
      for (const transactionData of transactionDataArray) {
        try {
          const savedTransaction = await prisma.transaction.create({
            data: transactionData,
          });
          savedTransactions.push(savedTransaction);
        } catch (error) {
          console.error('Error saving individual transaction:', error);
          // Continue with other transactions even if one fails
          continue;
        }
      }
    }

    if (savedTransactions.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Failed to save any transactions to database",
        message: "❌ **Save Failed**\n\nNo transactions could be saved to the database."
      }, { status: 500 });
    }

    const transactionIds = savedTransactions.map((txn: { id: { toString: () => any; }; }) => txn.id.toString());

    return NextResponse.json({
      success: true,
      transactionIds,
      count: savedTransactions.length,
      filteredCount: transactions.length - validTransactions.length,
      failedCount: validTransactions.length - savedTransactions.length,
      message: `🎉 **Bulk Upload Complete!**\n\nSuccessfully saved **${savedTransactions.length} transactions** to your account.${
        validTransactions.length !== transactions.length 
          ? `\n\n **Note:** ${transactions.length - validTransactions.length} invalid transactions were filtered out.`
          : ''
      }${
        savedTransactions.length !== validTransactions.length
          ? `\n\n⚠️ **Warning:** ${validTransactions.length - savedTransactions.length} transactions failed to save.`
          : ''
      }`
    });
  } catch (error: any) {
    console.error("Error confirming bulk upload:", error);
    
    // Enhanced error handling for prepared statement issues
    if (error.message?.includes('prepared statement') || error.code === '42P05') {
      console.log("Prisma prepared statement error detected, attempting recovery...");
      
      try {
        await prisma.$disconnect();
        console.log("Prisma disconnected successfully");
      } catch (disconnectError) {
        console.error("Error during Prisma disconnect:", disconnectError);
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: "Database connection issue. Please try again.",
          message: "❌ **Connection Error**\n\nA database connection issue occurred. Please try uploading again."
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to save bulk transactions",
        message: "❌ **Upload Failed**\n\nAn unexpected error occurred while processing your transactions. Please try again."
      },
      { status: 500 }
    );
  }
}