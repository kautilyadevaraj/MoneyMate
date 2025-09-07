"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bot, User, Check, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompanyAnalysisCharts } from "../company-analysis-charts";
import { StockPriceChart } from "../stock-price-chart";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    data?: any;
    requiresConfirmation?: boolean;
    confirmed?: boolean;
  };
}

interface AgentModeMessageProps {
  message: Message;
  onConfirmAction: (messageId: string, confirmed: boolean) => void;
}

export function AgentModeMessage({
  message,
  onConfirmAction,
}: AgentModeMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-2 animate-in slide-in-from-bottom-2 duration-300",
        message.type === "user" ? "justify-end" : "justify-start"
      )}
    >
      {message.type === "bot" && (
        <Avatar className="h-7 w-7 ring-1 ring-primary/20 flex-shrink-0">
          <AvatarFallback className="bg-primary/10">
            <Bot className="h-3.5 w-3.5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[85%] space-y-1",
          message.type === "user" ? "items-end" : "items-start"
        )}
      >
        <Card
          className={cn(
            "transition-all py-2 rounded-md duration-200 hover:shadow-md",
            message.type === "user"
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-muted/50 backdrop-blur-sm"
          )}
        >
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>

            {message.metadata?.intent === "company_analysis" &&
              message.metadata.data && (
                <div className="mt-4">
                  <CompanyAnalysisCharts
                    ticker={message.metadata.data.ticker}
                    data={message.metadata.data.analysisData}
                  />
                </div>
              )}

            {message.metadata?.intent === "stock_prediction" &&
              message.metadata.data && (
                <div className="mt-4">
                  <StockPriceChart
                    data={message.metadata.data.stockData.chartData}
                    summary={message.metadata.data.stockData.summary}
                    ticker={message.metadata.data.ticker}
                    timeWindow={message.metadata.data.stockData.timeWindow}
                  />
                </div>
              )}

            {(message.metadata?.intent === "add_transaction" ||
              message.metadata?.intent === "transaction_success") &&
              message.metadata.data && (
                <Table className="mt-3">
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-medium py-2">Amount</TableHead>
                      <TableHead className="font-medium py-2">
                        Description
                      </TableHead>
                      <TableHead className="font-medium py-2">
                        Category
                      </TableHead>
                      <TableHead className="font-medium py-2">
                        Account
                      </TableHead>
                      <TableHead className="font-medium py-2">Type</TableHead>
                      <TableHead className="font-medium py-2">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/20 transition-colors">
                      <TableCell className="py-2">
                        <span
                          className={cn(
                            "font-semibold",
                            message.metadata.data.transactionType === "EXPENSE"
                              ? "text-red-600"
                              : "text-green-600"
                          )}
                        >
                          {message.metadata.data.transactionType === "EXPENSE"
                            ? "-"
                            : "+"}
                          ₹{message.metadata.data.amount}
                        </span>
                      </TableCell>
                      <TableCell className="py-2">
                        {message.metadata.data.description}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className="text-xs">
                          {message.metadata.data.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        {message.metadata.data.account}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge
                          variant={
                            message.metadata.data.transactionType === "EXPENSE"
                              ? "destructive"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {message.metadata.data.transactionType}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 font-mono text-xs">
                        {message.metadata.data.date}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}

            {message.metadata?.intent === "bulk_upload" &&
              message.metadata.data && (
                <div className="mt-3 border rounded-lg overflow-hidden bg-background/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-medium py-2">Date</TableHead>
                        <TableHead className="font-medium py-2">
                          Description
                        </TableHead>
                        <TableHead className="font-medium py-2">
                          Amount
                        </TableHead>
                        <TableHead className="font-medium py-2">
                          Category
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {message.metadata.data
                        .slice(0, 5)
                        .map((txn: any, idx: number) => (
                          <TableRow
                            key={idx}
                            className="hover:bg-muted/20 transition-colors"
                          >
                            <TableCell className="font-mono text-xs py-2">
                              {txn.date}
                            </TableCell>
                            <TableCell className="py-2">
                              {txn.description}
                            </TableCell>
                            <TableCell className="font-semibold py-2">
                              ₹{txn.amount}
                            </TableCell>
                            <TableCell className="py-2">
                              <Badge variant="outline" className="text-xs">
                                {txn.category}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  {message.metadata.data.length > 5 && (
                    <div className="p-2 text-xs text-muted-foreground text-center bg-muted/20 border-t">
                      ... and {message.metadata.data.length - 5} more
                      transactions
                    </div>
                  )}
                </div>
              )}

            {message.metadata?.requiresConfirmation &&
              !message.metadata.confirmed && (
                <div className="flex gap-2 mb-2 animate-in fade-in duration-300">
                  <Button
                    size="sm"
                    onClick={() => onConfirmAction(message.id, true)}
                    className="bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onConfirmAction(message.id, false)}
                    className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground px-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>

      {message.type === "user" && (
        <Avatar className="h-7 w-7 ring-1 ring-primary/20 flex-shrink-0">
          <AvatarFallback className="bg-primary/10">
            <User className="h-3.5 w-3.5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
