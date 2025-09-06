"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export function AIChat() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-balance">
          AI Financial Assistant
        </h1>
      </div>
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chat with your AI Financial Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about your finances, get insights, and receive
            personalized advice
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 bg-muted/30 rounded-lg p-4 mb-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-card p-3 rounded-lg max-w-[80%]">
                  <p className="text-sm">
                    Hello! I'm your AI Financial Assistant. I can help you
                    analyze your spending patterns, investment performance, and
                    provide personalized financial advice. What would you like
                    to know?
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
                  <p className="text-sm">
                    How is my investment portfolio performing compared to the
                    market?
                  </p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-card p-3 rounded-lg max-w-[80%]">
                  <p className="text-sm">
                    Great question! Based on your portfolio data, you're
                    outperforming the NIFTY 50 by approximately 10.7% this year.
                    Your portfolio value has grown to ₹24,90,000, showing strong
                    performance in your equity and mutual fund investments.
                    Would you like me to analyze specific sectors or suggest
                    rebalancing strategies?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ask about your finances, investments, or budgets..."
              className="flex-1"
            />
            <Button>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
