import type React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata: Metadata = {
  title: "AI Financial Assistant",
  description: "Manage your finances with AI-powered insights",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
        <Suspense fallback={null}>

            <SidebarProvider>
              <AppSidebar />
              {children}
            </SidebarProvider>

        </Suspense>
      </div>
  );
}
