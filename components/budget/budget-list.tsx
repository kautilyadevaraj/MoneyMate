"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const budgets = [
  {
    id: 1,
    category: "Food & Dining",
    budget: 15000,
    spent: 12340,
    period: "Monthly",
    status: "on-track",
    color: "bg-green-500",
  },
  {
    id: 2,
    category: "Transportation",
    budget: 8000,
    spent: 9200,
    period: "Monthly",
    status: "over-budget",
    color: "bg-red-500",
  },
  {
    id: 3,
    category: "Entertainment",
    budget: 5000,
    spent: 3450,
    period: "Monthly",
    status: "on-track",
    color: "bg-blue-500",
  },
  {
    id: 4,
    category: "Shopping",
    budget: 12000,
    spent: 8900,
    period: "Monthly",
    status: "on-track",
    color: "bg-purple-500",
  },
  {
    id: 5,
    category: "Utilities",
    budget: 6000,
    spent: 5800,
    period: "Monthly",
    status: "near-limit",
    color: "bg-orange-500",
  },
  {
    id: 6,
    category: "Healthcare",
    budget: 4000,
    spent: 1200,
    period: "Monthly",
    status: "on-track",
    color: "bg-teal-500",
  },
];

export function BudgetList() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "over-budget":
        return <Badge variant="destructive">Over Budget</Badge>;
      case "near-limit":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Near Limit
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            On Track
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.budget) * 100;
          const remaining = budget.budget - budget.spent;

          return (
            <div key={budget.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${budget.color}`} />
                  <div>
                    <h4 className="font-medium">{budget.category}</h4>
                    <p className="text-sm text-muted-foreground">
                      {budget.period}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(budget.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Budget
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Budget
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>₹{budget.spent.toLocaleString()} spent</span>
                  <span>
                    {remaining >= 0
                      ? `₹${remaining.toLocaleString()} remaining`
                      : `₹${Math.abs(remaining).toLocaleString()} over budget`}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹0</span>
                  <span>₹{budget.budget.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
