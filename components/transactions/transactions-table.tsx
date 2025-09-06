"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, Filter, X } from "lucide-react";

const transactions = [
  {
    date: "2025-08-01",
    description: "UPI - MERCHANT 1",
    category: "Food & Dining",
    amount: -500,
    account: "HDFC",
  },
  {
    date: "2025-08-02",
    description: "UPI - MERCHANT 2",
    category: "Food & Dining",
    amount: -573,
    account: "HDFC",
  },
  {
    date: "2025-08-03",
    description: "Salary Credit",
    category: "Income",
    amount: 85000,
    account: "ICICI",
  },
  {
    date: "2025-08-04",
    description: "UPI - GROCERY STORE",
    category: "Groceries",
    amount: -2340,
    account: "SBI",
  },
  {
    date: "2025-08-05",
    description: "UPI - FUEL STATION",
    category: "Transportation",
    amount: -1200,
    account: "HDFC",
  },
  {
    date: "2025-08-06",
    description: "Investment SIP",
    category: "Investment",
    amount: -15000,
    account: "ICICI",
  },
  {
    date: "2025-08-07",
    description: "UPI - COFFEE SHOP",
    category: "Food & Dining",
    amount: -250,
    account: "SBI",
  },
  {
    date: "2025-08-08",
    description: "Online Shopping",
    category: "Shopping",
    amount: -3500,
    account: "HDFC",
  },
  {
    date: "2025-08-09",
    description: "Electricity Bill",
    category: "Bills & Utilities",
    amount: -1800,
    account: "ICICI",
  },
  {
    date: "2025-08-10",
    description: "Freelance Payment",
    category: "Income",
    amount: 25000,
    account: "SBI",
  },
  {
    date: "2025-08-05",
    description: "UPI - FUEL STATION",
    category: "Transportation",
    amount: -1200,
    account: "HDFC",
  },
  {
    date: "2025-08-06",
    description: "Investment SIP",
    category: "Investment",
    amount: -15000,
    account: "ICICI",
  },
  {
    date: "2025-08-07",
    description: "UPI - COFFEE SHOP",
    category: "Food & Dining",
    amount: -250,
    account: "SBI",
  },
  {
    date: "2025-08-08",
    description: "Online Shopping",
    category: "Shopping",
    amount: -3500,
    account: "HDFC",
  },
  {
    date: "2025-08-09",
    description: "Electricity Bill",
    category: "Bills & Utilities",
    amount: -1800,
    account: "ICICI",
  },
  {
    date: "2025-08-10",
    description: "Freelance Payment",
    category: "Income",
    amount: 25000,
    account: "SBI",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface TransactionsTableProps {
  showFilters?: boolean;
}

export function TransactionsTable({
  showFilters = false,
}: TransactionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || transaction.category === categoryFilter;
    const matchesAccount =
      accountFilter === "all" || transaction.account === accountFilter;
    const matchesAmount =
      amountFilter === "all" ||
      (amountFilter === "income" && transaction.amount > 0) ||
      (amountFilter === "expense" && transaction.amount < 0);

    return matchesSearch && matchesCategory && matchesAccount && matchesAmount;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setAccountFilter("all");
    setAmountFilter("all");
  };

  const hasActiveFilters =
    searchTerm ||
    categoryFilter !== "all" ||
    accountFilter !== "all" ||
    amountFilter !== "all";

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Transactions</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm bg-transparent"
                >
                  Last 30 days
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem>Last 90 days</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm bg-transparent"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[120px] sm:w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                    <SelectItem value="Groceries">Groceries</SelectItem>
                    <SelectItem value="Transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Bills & Utilities">
                      Bills & Utilities
                    </SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Income">Income</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={accountFilter} onValueChange={setAccountFilter}>
                  <SelectTrigger className="w-[100px] sm:w-[120px]">
                    <SelectValue placeholder="Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    <SelectItem value="HDFC">HDFC</SelectItem>
                    <SelectItem value="ICICI">ICICI</SelectItem>
                    <SelectItem value="SBI">SBI</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={amountFilter} onValueChange={setAmountFilter}>
                  <SelectTrigger className="w-[100px] sm:w-[120px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expenses</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs sm:text-sm"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">Date</TableHead>
                <TableHead className="min-w-[200px]">Description</TableHead>
                <TableHead className="min-w-[120px]">Category</TableHead>
                <TableHead className="min-w-[100px]">
                  Amount
                </TableHead>
                <TableHead className="min-w-[80px]">Account</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {transaction.date}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`font-medium ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>{transaction.account}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No transactions found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
