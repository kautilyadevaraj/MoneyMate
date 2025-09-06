import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const account = searchParams.get("account") || "all";
    const type = searchParams.get("type") || "all";
    const days = Number.parseInt(searchParams.get("days") || "30");

    // Calculate date filter
    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - days);

    // Build where clause
    const where: any = {
      user: {
        email: user.email,
      },
      createdAt: {
        gte: dateFilter,
      },
    };

    // Add search filter
    if (search) {
      where.OR = [
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    // Add category filter
    if (category !== "all") {
      where.category = {
        name: category,
      };
    }

    // Add account filter
    if (account !== "all") {
      where.account = {
        name: account,
      };
    }

    // Add transaction type filter
    if (type !== "all") {
      where.transactionType = type.toUpperCase();
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        account: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data to match component expectations
    const transformedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      date: transaction.createdAt.toISOString().split("T")[0],
      description: transaction.description || "",
      category: transaction.category?.name || "Uncategorized",
      amount:
        transaction.transactionType === "EXPENSE"
          ? -transaction.amount
          : transaction.amount,
      account: transaction.account.name,
      referenceId: transaction.referenceId,
    }));

    return NextResponse.json(transformedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
