"use client";

import type React from "react";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartAreaDefaultProps {
  data: Array<{ month: string; desktop: number }>;
  title: string;
  description: string;
  icon: React.ReactNode;
  config: ChartConfig;
}

export function ChartAreaDefault({
  data,
  title,
  description,
  icon,
  config,
}: ChartAreaDefaultProps) {
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
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
