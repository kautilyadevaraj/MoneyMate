import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get unique categories
    const categories = await prisma.category.findMany({
      select: {
        name: true,
      },
      distinct: ["name"],
    });

    // Get unique accounts
    const accounts = await prisma.account.findMany({
      select: {
        name: true,
      },
      distinct: ["name"],
    });

    return NextResponse.json({
      categories: categories.map((c) => c.name),
      accounts: accounts.map((a) => a.name),
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 }
    );
  }
}
