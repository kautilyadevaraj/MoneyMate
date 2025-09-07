"use client";

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
} from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", url: "/" },
  { icon: CreditCard, label: "Transactions", url: "/transactions" },
  { icon: PiggyBank, label: "Budgets", url: "/budgets" },
  { icon: BarChart3, label: "Insights", url: "/insights" },
  { icon: Bot, label: "AI Chat", url: "/agent" },
];

const quickLinks = [
  { icon: Link, label: "Connect Bank (AppFlow)", url: "/connect-bank" },
  {
    icon: Upload,
    label: "Upload Document (Textract)",
    url: "/upload-document",
  },
  { icon: MessageCircle, label: "Chatbot (Lex)", url: "/chatbot" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                asChild
              >
                <a href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Bot className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">MoneyMate</span>
                    <span className="truncate text-xs">ASSISTANT</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.url}
                        >
                          <a href={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="group-data-[collapsible=icon]:block group-data-[collapsible=offcanvas]:hidden"
                      >
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
            <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickLinks.map((link) => (
                  <SidebarMenuItem key={link.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton size="sm" asChild>
                          <a href={link.url}>
                            <link.icon className="h-3 w-3" />
                            <span className="text-xs">{link.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="group-data-[collapsible=icon]:block group-data-[collapsible=offcanvas]:hidden"
                      >
                        {link.label}
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
