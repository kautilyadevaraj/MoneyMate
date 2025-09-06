"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Bot } from "lucide-react";

interface AgentModeHeaderProps {
  onClose: () => void;
}

export function AgentModeHeader({ onClose }: AgentModeHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bot className="h-6 w-6 text-primary animate-pulse" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            Agent Mode
          </h2>
          <p className="text-xs text-muted-foreground">
            AI Financial Assistant
          </p>
        </div>
        <Badge variant="secondary" className="animate-bounce">
          Active
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
