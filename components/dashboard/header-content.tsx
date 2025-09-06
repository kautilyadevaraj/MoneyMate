"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function HeaderContent() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between flex-1">
      <div className="relative flex-1 max-w-md ml-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions, documents, insights…"
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>

        <Avatar>
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
