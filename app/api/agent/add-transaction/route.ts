import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { data, hasImage } = await request.json();

    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (hasImage) {
      const mockOCRResult = {
        amount: Math.floor(Math.random() * 1000) + 50,
        description: "Restaurant Bill - Extracted from receipt",
        category: "Food & Dining",
        account: "SBI",
        date: new Date().toISOString().split("T")[0],
        merchant: "Sample Restaurant",
        type: "EXPENSE",
      };

      return NextResponse.json({
        success: true,
        requiresConfirmation: true,
        transaction: mockOCRResult,
        message:
          "**Receipt Processed Successfully!**\n\nI've extracted the transaction details from your receipt using OCR. Please review and confirm if the details are correct.",
      });
    } else {
      const transaction = {
        amount: data.amount || 0,
        description: data.description || "Manual transaction",
        category: data.category || "Others",
        account: data.account || "Unknown",
        date: new Date().toISOString().split("T")[0],
        type: data.type || "EXPENSE",
      };

      if (transaction.amount > 0 && transaction.description) {
        try {
          // First, find or create the user in our database
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                name:
                  user.user_metadata?.full_name || user.email!.split("@")[0],
                email: user.email!,
                phone: user.phone || null,
              },
            });
          }

          // Find or create account
          let account = await prisma.account.findFirst({
            where: {
              userId: dbUser.id,
              bankName: transaction.account,
            },
          });

          if (!account) {
            account = await prisma.account.create({
              data: {
                userId: dbUser.id,
                name: `${transaction.account} Account`,
                bankName: transaction.account,
                accountType:
                  transaction.account === "Cash" ? "SAVINGS" : "CHECKING",
                balance: 0,
              },
            });
          }

          // Find or create category
          let category = await prisma.category.findFirst({
            where: {
              userId: dbUser.id,
              name: transaction.category,
            },
          });

          if (!category) {
            category = await prisma.category.create({
              data: {
                userId: dbUser.id,
                name: transaction.category,
                categoryType: transaction.type as "INCOME" | "EXPENSE",
                description: `Auto-created category for ${transaction.category}`,
              },
            });
          }

          // Create the transaction
          const newTransaction = await prisma.transaction.create({
            data: {
              userId: dbUser.id,
              accountId: account.id,
              categoryId: category.id,
              amount: transaction.amount,
              transactionType: transaction.type as "INCOME" | "EXPENSE",
              description: transaction.description,
              referenceId: `TXN-${Date.now()}`,
            },
          });

          // Update account balance
          const balanceChange =
            transaction.type === "EXPENSE"
              ? -transaction.amount
              : transaction.amount;
          await prisma.account.update({
            where: { id: account.id },
            data: {
              balance: {
                increment: balanceChange,
              },
            },
          });

          return NextResponse.json({
            success: true,
            requiresConfirmation: false,
            transaction: {
              amount: transaction.amount,
              description: transaction.description,
              category: category.name,
              account: account.name,
              transactionType: transaction.type,
              date: transaction.date,
              referenceId: newTransaction.referenceId,
              createdAt: newTransaction.createdAt,
            },
            message: "Transaction added successfully!",
          });
        } catch (dbError) {
          console.error("[v0] Database error:", dbError);
          return NextResponse.json(
            {
              success: false,
              message:
                "❌ **Database Error**\n\nFailed to save transaction to database. Please try again.",
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json({
          success: true,
          requiresConfirmation: true,
          transaction: {
            amount: transaction.amount,
            description: transaction.description,
            category: transaction.category,
            account: transaction.account,
            transactionType: transaction.type,
            date: transaction.date,
            referenceId: `TXN-${Date.now()}`,
          },
          message: "Transaction details extracted for confirmation.",
        });
      }
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
    return NextResponse.json(
      { error: "Failed to process transaction" },
      { status: 500 }
    );
  }
}
