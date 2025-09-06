import type React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

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
  const supabase = createClient();

  supabase.auth.getUser().then(({ data }) => {
    if (!data)
      redirect('/login');
  });
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${montserrat.variable} ${montserrat.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
