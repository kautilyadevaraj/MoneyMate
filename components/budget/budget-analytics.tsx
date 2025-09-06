"use client";

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
  type ChartConfig,
} from "@/components/ui/chart";
import { PieChart, Pie } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

const spendingData = [
  { category: "food", amount: 12340, fill: "var(--color-food)" },
  {
    category: "transportation",
    amount: 9200,
    fill: "var(--color-transportation)",
  },
  { category: "shopping", amount: 8900, fill: "var(--color-shopping)" },
  { category: "utilities", amount: 5800, fill: "var(--color-utilities)" },
  {
    category: "entertainment",
    amount: 3450,
    fill: "var(--color-entertainment)",
  },
  { category: "healthcare", amount: 1200, fill: "var(--color-healthcare)" },
];

const chartConfig = {
  amount: {
    label: "Amount",
  },
  food: {
    label: "Food & Dining",
    color: "var(--chart-1)",
  },
  transportation: {
    label: "Transportation",
    color: "var(--chart-2)",
  },
  shopping: {
    label: "Shopping",
    color: "var(--chart-3)",
  },
  utilities: {
    label: "Utilities",
    color: "var(--chart-4)",
  },
  entertainment: {
    label: "Entertainment",
    color: "var(--chart-5)",
  },
  healthcare: {
    label: "Healthcare",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig;

const insights = [
  {
    title: "Highest Spending",
    description: "Food & Dining",
    amount: "₹12,340",
    icon: TrendingUp,
    color: "text-primary",
  },
  {
    title: "Over Budget",
    description: "Transportation",
    amount: "₹1,200",
    icon: AlertCircle,
    color: "text-destructive",
  },
  {
    title: "Best Performance",
    description: "Healthcare",
    amount: "70% under budget",
    icon: TrendingDown,
    color: "text-secondary",
  },
];

export function BudgetAnalytics() {
  return (
    <div className="space-y-6">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Spending Distribution</CardTitle>
          <CardDescription>Current month breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                formatter={(value: number, name: string) => [
                  `${name}: ₹${value.toLocaleString()}`,
                ]}
              />
              <Pie data={spendingData} dataKey="amount" nameKey="category" />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Spending increased by 8.3% this month{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Food & Dining remains the highest expense category
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className={`p-2 rounded-full bg-muted`}>
                  <Icon className={`h-4 w-4 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{insight.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
                <div className="text-sm font-medium">{insight.amount}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
