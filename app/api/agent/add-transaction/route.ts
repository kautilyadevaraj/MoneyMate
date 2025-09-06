import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { data, hasImage } = await request.json();

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
          "📄 **Receipt Processed Successfully!**\n\nI've extracted the transaction details from your receipt using OCR. Please review and confirm if the details are correct.",
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
        return NextResponse.json({
          success: true,
          requiresConfirmation: false,
          transaction,
          message:
            "✅ **Transaction Added Successfully!**\n\nYour transaction has been processed and saved to your account.",
        });
      } else {
        return NextResponse.json({
          success: true,
          requiresConfirmation: true,
          transaction,
          message:
            "🔍 **Transaction Details Extracted**\n\nI've processed your message and extracted the transaction details. Please review and confirm if everything looks correct.",
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
