import { NextResponse } from "next/server";
import { LlamaParseReader } from "llama-cloud-services";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

import { b } from "../../../../baml_client";

export async function POST(req: Request) {
  try {
    
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save uploaded file temporarily
    const tempDir = os.tmpdir();
    const tempPath = path.join(tempDir, `${Date.now()}-${file.name}`);
    await fs.writeFile(tempPath, buffer);

    // Parse using LlamaParse
    const reader = new LlamaParseReader({
      apiKey: process.env.LLAMA_CLOUD_API_KEY!,
      resultType: "markdown",
    });

    const documents = await reader.loadData(tempPath);

    // Cleanup temp file
    await fs.unlink(tempPath);

    // Combine all document text
    const markdown = documents.map((d) => d.text).join("\n\n");
    
    // //console.log("About to classify markdown:", markdown.substring(0, 200) + "...");
    // console.log("Available BAML functions:", Object.keys(b));

    // // Extract receipt data using BAML
    // console.log("About to call ExtractTransactions with markdown length:", markdown.length);
    // console.log("Markdown preview:", markdown.substring(0, 200) + "...");
    
    const TransactionData = await b.ExtractTransactions(markdown);
    
    console.log("Transaction extraction result:", TransactionData);
    console.log("Transaction data type:", typeof TransactionData);
    console.log("Is array:", Array.isArray(TransactionData));

    // Check if the extraction returned an error
    if (Array.isArray(TransactionData) && TransactionData.length > 0 && 'error' in TransactionData[0]) {
      console.log("BAML extraction error:", TransactionData[0].error);
      return NextResponse.json({
        success: false,
        error: TransactionData[0].error,
        transactions: TransactionData
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      transactions: TransactionData,
    });

  } catch (err: any) {
    console.error("Error processing document:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process document" }, 
      { status: 500 }
    );
  }
}
