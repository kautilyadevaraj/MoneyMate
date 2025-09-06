"use client";

import type React from "react";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Upload, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentModeInputProps {
  input: string;
  setInput: (value: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export function AgentModeInput({
  input,
  setInput,
  uploadedFile,
  setUploadedFile,
  onSendMessage,
  isLoading,
}: AgentModeInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {uploadedFile && (
        <div className="mb-3 p-3 bg-muted/50 rounded-lg flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{uploadedFile.name}</span>
            <span className="text-xs text-muted-foreground">
              ({(uploadedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUploadedFile(null)}
            className="hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message or upload a file..."
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className={cn(
              "pr-12 transition-all duration-200",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary",
              isLoading && "opacity-50"
            )}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="flex gap-1">
                <div
                  className="w-1 h-1 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-1 h-1 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1 h-1 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept=".jpg,.jpeg,.png,.pdf,.csv,.xlsx"
        />

        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
        >
          <Upload className="h-4 w-4" />
        </Button>

        <Button
          onClick={onSendMessage}
          disabled={isLoading || (!input.trim() && !uploadedFile)}
          className="hover:scale-105 transition-all duration-200 disabled:hover:scale-100"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
