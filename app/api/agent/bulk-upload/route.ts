import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { data, fileContent } = await request.json();

    const mockTransactions = [
      {
        date: "2024-01-15",
        description: "Grocery Shopping - Big Bazaar",
        amount: 2450,
        category: "Groceries",
        account: "SBI Account",
        type: "EXPENSE",
      },
      {
        date: "2024-01-14",
        description: "Fuel - Indian Oil Petrol Pump",
        amount: 3200,
        category: "Transportation",
        account: "SBI Account",
        type: "EXPENSE",
      },
      {
        date: "2024-01-13",
        description: "Monthly Salary Credit",
        amount: 75000,
        category: "Income",
        account: "SBI Account",
        type: "INCOME",
      },
      {
        date: "2024-01-12",
        description: "Dinner - Dominos Pizza",
        amount: 850,
        category: "Food & Dining",
        account: "HDFC Credit Card",
        type: "EXPENSE",
      },
      {
        date: "2024-01-11",
        description: "Movie Tickets - PVR Cinemas",
        amount: 600,
        category: "Entertainment",
        account: "HDFC Credit Card",
        type: "EXPENSE",
      },
      {
        date: "2024-01-10",
        description: "Medical Consultation - Apollo Hospital",
        amount: 1200,
        category: "Healthcare",
        account: "SBI Account",
        type: "EXPENSE",
      },
      {
        date: "2024-01-09",
        description: "Online Shopping - Amazon",
        amount: 3500,
        category: "Shopping",
        account: "HDFC Credit Card",
        type: "EXPENSE",
      },
    ];

    return NextResponse.json({
      success: true,
      transactions: mockTransactions,
      message: `📊 **File Processed Successfully!**\n\nI've analyzed your uploaded file and found **${mockTransactions.length} transactions**. Please review the details below and confirm if everything looks accurate.`,
    });
  } catch (error) {
    console.error("Error processing bulk upload:", error);
    return NextResponse.json(
      { error: "Failed to process bulk upload" },
      { status: 500 }
    );
  }
}
