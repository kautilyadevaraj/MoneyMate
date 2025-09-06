"use client";

import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  PiggyBank,
  BarChart3,
  FileText,
  Shield,
  Settings,
  Link,
  Upload,
  MessageCircle,
  Bot,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onClose: () => void;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: CreditCard, label: "Transactions" },
  { icon: TrendingUp, label: "Investments" },
  { icon: PiggyBank, label: "Budgets" },
  { icon: BarChart3, label: "Insights" },
  { icon: FileText, label: "Documents" },
  { icon: Shield, label: "Compliance" },
  { icon: Bot, label: "AI Chat" },
  { icon: Settings, label: "Settings" },
];

const quickLinks = [
  { icon: Link, label: "Connect Bank (AppFlow)" },
  { icon: Upload, label: "Upload Document (Textract)" },
  { icon: MessageCircle, label: "Chatbot (Lex)" },
];

export function Sidebar({
  isOpen,
  activeSection,
  onSectionChange,
  onClose,
}: SidebarProps) {
  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-sidebar-foreground">
            AI FINANCIAL ASSISTANT
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant={activeSection === item.label ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              onSectionChange(item.label);
              onClose();
            }}
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-sidebar-foreground">
            Quick Links
          </h4>
          {quickLinks.map((link) => (
            <Button
              key={link.label}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
            >
              <link.icon className="h-3 w-3 mr-2" />
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
