"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AgentModeHeader } from "./agent-mode-header";
import { AgentModeMessage } from "./agent-mode-message";
import { AgentModeInput } from "./agent-mode-input";
import Loader from "@/components/loader";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  userImage?: string; // Added userImage field to store user avatar
  metadata?: {
    intent?: string;
    data?: any;
    requiresConfirmation?: boolean;
    confirmed?: boolean;
  };
}

interface AgentModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgentMode({ isOpen, onClose }: AgentModeProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm your AI Financial Assistant. I can help you add transactions, upload bulk data, manage budgets, and more. What would you like to do today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() && !uploadedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: uploadedFile
        ? `[File uploaded: ${uploadedFile.name}] ${input}`
        : input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let fileContent: string | null = null;
    if (uploadedFile) {
      fileContent = await uploadedFile.text();
    }

    const handleBulkUpload = async (data: any) => {
      if (!fileContent) {
        console.error("Attempted bulk upload without file content.");
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content:
            "There was an issue reading the file. Please try uploading it again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      try {
        const response = await fetch("/api/agent/bulk-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileContent }),
        });

        const result = await response.json();

        const tableMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: `I've processed your file and found ${result.transactions.length} transactions. Please review and confirm:`,
          timestamp: new Date(),
          metadata: {
            intent: "bulk_upload",
            data: result.transactions,
            requiresConfirmation: true,
          },
        };
        setMessages((prev) => [...prev, tableMessage]);
      } catch (error) {
        console.error("Error processing bulk upload:", error);
      }
    };

    try {
      const response = await fetch("/api/agent/detect-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          hasFile: !!uploadedFile,
          fileName: uploadedFile?.name,
        }),
      });

      const result = await response.json();

      if (result.intent === "add_transaction") {
        await handleAddTransaction(result.data);
      } else if (result.intent === "bulk_upload") {
        await handleBulkUpload(result.data);
      } else if (result.intent === "budget_management") {
        const botResponse = `🎯 **Budget Management**

I can help you with budgeting! While I'm still learning this feature, here are some quick tips:

• **Track your spending** - Add your daily transactions so I can analyze patterns
• **Set realistic goals** - Start with tracking for a month to understand your habits  
• **Use categories** - Organize expenses into Food, Transport, Entertainment, etc.

For now, you can add transactions and I'll help you see where your money goes. Try saying "I spent ₹200 on lunch" to get started!`;

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: botResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else if (result.intent === "investment_query") {
        const botResponse = `📈 **Investment Insights**

Great question about investments! While I'm developing this feature, here are some basics:

• **Start with emergency fund** - Save 3-6 months of expenses first
• **Diversify your portfolio** - Don't put all money in one investment
• **Think long-term** - Consistent investing beats timing the market

I can help you track your current transactions to free up money for investing. Want to add some expenses so we can see your spending patterns?`;

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: botResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else if (result.intent === "general_query") {
        const botResponse = result.response;

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: botResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const successMessage: Message = {
          id: Date.now().toString(),
          type: "bot",
          content: result.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMessage]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput("");
    setUploadedFile(null);
    setIsLoading(false);
  };

  const handleAddTransaction = async (transactionData: any) => {
    try {
      const response = await fetch("/api/agent/add-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: transactionData,
          hasImage: !!uploadedFile,
        }),
      });

      const result = await response.json();

      if (result.requiresConfirmation) {
        const confirmationMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: `I've extracted the following transaction details. Please confirm if this is correct:

**Amount:** ₹${result.transaction.amount}
**Description:** ${result.transaction.description}
**Category:** ${result.transaction.category}
**Account:** ${result.transaction.account}
**Date:** ${result.transaction.date}

Would you like me to save this transaction?`,
          timestamp: new Date(),
          metadata: {
            intent: "add_transaction",
            data: result.transaction,
            requiresConfirmation: true,
          },
        };
        setMessages((prev) => [...prev, confirmationMessage]);
      } else {
        const successMessage: Message = {
          id: Date.now().toString(),
          type: "bot",
          content: "The following transaction has been added successfully!",
          timestamp: new Date(),
          metadata: {
            intent: "transaction_success",
            data: result.transaction,
          },
        };
        setMessages((prev) => [...prev, successMessage]);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleBulkUpload = async (data: any) => {
    try {
      const response = await fetch("/api/agent/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      const result = await response.json();

      const tableMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `I've processed your bulk upload file. Found ${result.transactions.length} transactions. Please review and confirm:`,
        timestamp: new Date(),
        metadata: {
          intent: "bulk_upload",
          data: result.transactions,
          requiresConfirmation: true,
        },
      };
      setMessages((prev) => [...prev, tableMessage]);
    } catch (error) {
      console.error("Error processing bulk upload:", error);
    }
  };

  const handleConfirmAction = async (messageId: string, confirmed: boolean) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message?.metadata) return;

    if (confirmed) {
      try {
        if (message.metadata.intent === "add_transaction") {
          await fetch("/api/agent/confirm-transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transaction: message.metadata.data }),
          });

          const successMessage: Message = {
            id: Date.now().toString(),
            type: "bot",
            content: "✅ Transaction has been saved successfully!",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, successMessage]);
        } else if (message.metadata.intent === "bulk_upload") {
          await fetch("/api/agent/confirm-bulk-upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transactions: message.metadata.data }),
          });

          const successMessage: Message = {
            id: Date.now().toString(),
            type: "bot",
            content: `✅ Successfully added ${message.metadata.data.length} transactions to your account!`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, successMessage]);
        }
      } catch (error) {
        console.error("Error confirming action:", error);
      }
    } else {
      const cancelMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content:
          "Action cancelled. Feel free to try again with different details.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, cancelMessage]);
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, metadata: { ...m.metadata, confirmed } }
          : m
      )
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-md",
          "animate-in fade-in duration-300"
        )}
      >
        <div
          className={cn(
            "h-screen w-screen bg-background flex flex-col",
            "animate-in slide-in-from-bottom-4 duration-500"
          )}
        >
          <AgentModeHeader onClose={onClose} />

          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 space-y-3">
              {isLoading ? (
                <>
                  {messages
                    .slice(-1)
                    .map(
                      (message) =>
                        message.type === "user" && (
                          <AgentModeMessage
                            key={message.id}
                            message={message}
                            onConfirmAction={handleConfirmAction}
                          />
                        )
                    )}
                  <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-in zoom-in-50 duration-300">
                      <Loader />
                    </div>
                  </div>
                </>
              ) : (
                messages.map((message) => (
                  <AgentModeMessage
                    key={message.id}
                    message={message}
                    onConfirmAction={handleConfirmAction}
                  />
                ))
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <AgentModeInput
            input={input}
            setInput={setInput}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
