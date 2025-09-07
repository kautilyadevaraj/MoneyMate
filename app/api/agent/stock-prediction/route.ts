import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { ticker, timeWindow = "1D" } = await request.json();

    if (!ticker) {
      return NextResponse.json(
        { error: "Ticker symbol is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "SerpAPI key not configured" },
        { status: 500 }
      );
    }

    const url = `https://serpapi.com/search.json?engine=google_finance&q=${ticker}:NASDAQ&window=${timeWindow}&api_key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`SerpAPI request failed: ${response.status}`);
    }

    const stockData = await response.json();

    const chartData =
      stockData.graph?.map((point: any, index: number) => ({
        time: new Date(point.date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        price: point.price,
        volume: point.volume,
        index: index,
      })) || [];

    let prediction = null;
    try {
      const predictionResponse = await fetch(
        "https://37ae75b0c559.ngrok-free.app/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ticker }),
        }
      );

      if (predictionResponse.ok) {
        prediction = await predictionResponse.json();
        console.log("Prediction data:", prediction); 
      }
    } catch (predictionError) {
      console.error("[v0] Prediction API error:", predictionError);
      // Continue without prediction if it fails
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: stockData.summary,
        chartData: chartData,
        ticker: ticker,
        timeWindow: timeWindow,
        prediction: prediction, // Include prediction data in response
      },
    });
  } catch (error) {
    console.error("[v0] Stock prediction error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
