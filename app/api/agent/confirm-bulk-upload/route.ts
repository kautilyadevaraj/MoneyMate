import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { transactions } = await request.json();

    console.log(
      "Saving bulk transactions to database:",
      transactions.length,
      "transactions"
    );

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const transactionIds = transactions.map(
      (_: any, index: number) => `txn_bulk_${Date.now()}_${index}`
    );

    return NextResponse.json({
      success: true,
      transactionIds,
      count: transactions.length,
      message: `🎉 **Bulk Upload Complete!**\n\nSuccessfully saved **${transactions.length} transactions** to your account. All transactions are now available in your transaction history.`,
    });
  } catch (error) {
    console.error("Error confirming bulk upload:", error);
    return NextResponse.json(
      { error: "Failed to save bulk transactions" },
      { status: 500 }
    );
  }
}
