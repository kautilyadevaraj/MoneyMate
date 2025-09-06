import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { message, hasFile, fileName } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a financial assistant AI. Analyze the user's message and determine their intent. 

User message: "${message}"
Has file attached: ${hasFile}
File name: ${fileName || "none"}

Available intents:
1. "add_transaction" - User wants to add a single transaction (mentions spending money, buying something, payment, etc.)
2. "bulk_upload" - User wants to upload multiple transactions from a file (CSV, Excel, bank statement)
3. "budget_management" - User asks about budgets, spending limits, budget planning
4. "investment_query" - User asks about investments, portfolio, stocks, mutual funds
5. "general_query" - General conversation, greetings, or other financial questions

If it's add_transaction, also extract:
- Amount (number only, no currency symbols)
- Category (Food & Dining, Transportation, Entertainment, Shopping, Groceries, Healthcare, Bills & Utilities, Others)
- Account type (SBI, HDFC, ICICI, AXIS, KOTAK, Cash, Credit Card, or Unknown)
- Description (clean version of what they spent on)

IMPORTANT: Respond ONLY with valid JSON. No additional text, explanations, or markdown formatting.

{
  "intent": "intent_name",
  "confidence": 0.0-1.0,
  "response": "helpful response to user",
  "data": {
    "amount": number (only for add_transaction),
    "category": "category" (only for add_transaction),
    "account": "account" (only for add_transaction),
    "description": "description" (only for add_transaction),
    "type": "EXPENSE" (only for add_transaction),
    "fileName": "filename" (only for bulk_upload)
  }
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("[v0] Raw Gemini response:", text);

    // Remove markdown code blocks if present
    text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");

    // Remove any leading/trailing whitespace
    text = text.trim();

    // Find JSON content between curly braces
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    console.log("[v0] Cleaned response:", text);

    try {
      const parsedResponse = JSON.parse(text);
      console.log("[v0] Successfully parsed response:", parsedResponse);
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error("[v0] Failed to parse Gemini response:", text);
      console.error("[v0] Parse error:", parseError);

      let fallbackIntent = "general_query";
      let fallbackResponse =
        "I'm here to help with your finances! I can help you add transactions, manage budgets, and answer financial questions. What would you like to do?";

      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("spent") ||
        lowerMessage.includes("bought") ||
        lowerMessage.includes("paid") ||
        lowerMessage.includes("rupees") ||
        lowerMessage.includes("₹") ||
        lowerMessage.includes("rs")
      ) {
        fallbackIntent = "add_transaction";
        fallbackResponse =
          "I understand you want to add a transaction, but I need more details. Could you please provide the amount, what you spent on, and which account you used?";
      } else if (
        hasFile ||
        lowerMessage.includes("upload") ||
        lowerMessage.includes("bulk") ||
        lowerMessage.includes("csv")
      ) {
        fallbackIntent = "bulk_upload";
        fallbackResponse =
          "I see you want to upload transactions in bulk. Please upload your file and I'll help you process it.";
      } else if (
        lowerMessage.includes("budget") ||
        lowerMessage.includes("spending limit")
      ) {
        fallbackIntent = "budget_management";
        fallbackResponse =
          "I can help you with budget management. What would you like to know about your budgets?";
      } else if (
        lowerMessage.includes("investment") ||
        lowerMessage.includes("portfolio") ||
        lowerMessage.includes("stocks")
      ) {
        fallbackIntent = "investment_query";
        fallbackResponse =
          "I can help you with investment-related questions. What would you like to know about your investments?";
      }

      return NextResponse.json({
        intent: fallbackIntent,
        confidence: 0.6,
        response: fallbackResponse,
      });
    }
  } catch (error) {
    console.error("[v0] Error in intent detection:", error);
    return NextResponse.json(
      { error: "Failed to detect intent" },
      { status: 500 }
    );
  }
}
