import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { ticker } = await request.json();

    if (!ticker) {
      return NextResponse.json(
        { error: "Ticker symbol is required" },
        { status: 400 }
      );
    }

    // Call the external analysis API
    const response = await fetch(
      "https://37ae75b0c559.ngrok-free.app/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker: ticker.toUpperCase() }),
      }
    );

    if (!response.ok) {
      throw new Error(`Analysis API returned ${response.status}`);
    }

    const responseText = await response.text();

    const sanitizedText = responseText
      .replace(/:\s*NaN/g, ": null")
      .replace(/,\s*NaN/g, ", null")
      .replace(/\[\s*NaN/g, "[null");

    const analysisData = JSON.parse(sanitizedText);

    return NextResponse.json({
      success: true,
      ticker: ticker.toUpperCase(),
      data: analysisData,
      message: `Financial analysis for ${ticker.toUpperCase()} has been completed successfully.`,
    });
  } catch (error) {
    console.error("[v0] Company analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze company",
        message:
          "Unable to fetch company analysis data. Please check the ticker symbol and try again.",
      },
      { status: 500 }
    );
  }
}
