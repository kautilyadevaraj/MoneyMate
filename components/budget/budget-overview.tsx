"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react";

const overviewData = [
  {
    title: "Total Budget",
    amount: "₹85,000",
    icon: Target,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Total Spent",
    amount: "₹52,340",
    icon: TrendingDown,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    title: "Remaining",
    amount: "₹32,660",
    icon: TrendingUp,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    title: "Over Budget",
    amount: "₹3,200",
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

export function BudgetOverview() {
  const spentPercentage = (52340 / 85000) * 100;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewData.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${item.bgColor}`}>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.amount}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Budget Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>₹52,340 spent of ₹85,000 budget</span>
            <span className="font-medium">{spentPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={spentPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹0</span>
            <span>₹85,000</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
