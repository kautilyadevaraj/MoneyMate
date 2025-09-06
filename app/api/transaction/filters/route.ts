import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: {
        transactions: {
          some: {
            user: {
              email: user.email,
            },
          },
        },
      },
      select: {
        name: true,
      },
      distinct: ["name"],
    });

    const accounts = await prisma.account.findMany({
      where: {
        transactions: {
          some: {
            user: {
              email: user.email,
            },
          },
        },
      },
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
