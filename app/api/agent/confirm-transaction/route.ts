import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { transaction } = await request.json();

    console.log("Saving transaction to database:", transaction);

    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      transactionId: `txn_${Date.now()}`,
      message: `✅ **Transaction Confirmed!**\n\nYour transaction has been successfully saved to your account. You can view it in your transaction history.`,
    });
  } catch (error) {
    console.error("Error confirming transaction:", error);
    return NextResponse.json(
      { error: "Failed to save transaction" },
      { status: 500 }
    );
  }
}
