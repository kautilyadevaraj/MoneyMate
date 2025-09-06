"use client";

import type React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartBarMultipleProps {
  data: Array<{ month: string; desktop: number; mobile: number }>;
  title: string;
  description: string;
  icon: React.ReactNode;
  config: ChartConfig;
}

export function ChartBarMultiple({
  data,
  title,
  description,
  icon,
  config,
}: ChartBarMultipleProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ChartContainer config={config}>
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
