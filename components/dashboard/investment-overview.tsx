"use client";

import type { ChartConfig } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

const portfolioData = [
  { month: "January", portfolio: 2200000, nifty: 2100000 },
  { month: "February", portfolio: 2350000, nifty: 2150000 },
  { month: "March", portfolio: 2280000, nifty: 2080000 },
  { month: "April", portfolio: 2420000, nifty: 2200000 },
  { month: "May", portfolio: 2380000, nifty: 2180000 },
  { month: "June", portfolio: 2490000, nifty: 2250000 },
];

const contributionsData = [
  { month: "January", contributions: 50000, withdrawals: 10000 },
  { month: "February", contributions: 75000, withdrawals: 15000 },
  { month: "March", contributions: 60000, withdrawals: 25000 },
  { month: "April", contributions: 80000, withdrawals: 5000 },
  { month: "May", contributions: 65000, withdrawals: 20000 },
  { month: "June", contributions: 90000, withdrawals: 8000 },
];

const portfolioChartConfig = {
  portfolio: {
    label: "Portfolio",
    color: "var(--chart-1)",
  },
  nifty: {
    label: "NIFTY 50",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const contributionsChartConfig = {
  contributions: {
    label: "Contributions",
    color: "var(--chart-1)",
  },
  withdrawals: {
    label: "Withdrawals",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function InvestmentOverview() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio vs NIFTY 50</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={portfolioChartConfig}>
            <LineChart
              accessibilityLayer
              data={portfolioData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    notation: "compact",
                  }).format(Number(value))
                }
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="portfolio"
                type="monotone"
                stroke="var(--color-portfolio)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="nifty"
                type="monotone"
                stroke="var(--color-nifty)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none font-medium">
                Portfolio outperforming by 8.2%{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                Showing portfolio performance vs NIFTY 50 for the last 6 months
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contributions vs Withdrawals</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={contributionsChartConfig}>
            <LineChart
              accessibilityLayer
              data={contributionsData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    notation: "compact",
                  }).format(Number(value))
                }
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="contributions"
                type="monotone"
                stroke="var(--color-contributions)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="withdrawals"
                type="monotone"
                stroke="var(--color-withdrawals)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none font-medium">
                Net positive flow of ₹4.2L this period{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                Showing cash flow patterns for the last 6 months
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
