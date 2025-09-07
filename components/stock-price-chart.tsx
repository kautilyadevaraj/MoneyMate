"use client";

import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface StockPriceChartProps {
  data: Array<{
    time: string;
    price: number;
    volume: number;
    index: number;
  }>;
  summary: {
    title: string;
    stock: string;
    exchange: string;
    price: string;
    extracted_price: number;
    currency: string;
    market?: {
      price_movement: {
        percentage: number;
        value: number;
        movement: string;
      };
    };
  };
  ticker: string;
  timeWindow: string;
  prediction?: {
    result: string;
    status: string;
  } | null;
}

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function StockPriceChart({
  data,
  summary,
  ticker,
  timeWindow,
  prediction,
}: StockPriceChartProps) {
  const isPositive = summary.market?.price_movement?.movement === "Up";
  const priceChange = summary.market?.price_movement?.value || 0;
  const percentChange = summary.market?.price_movement?.percentage || 0;

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {summary.title} ({summary.stock})
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {summary.currency}
              {summary.extracted_price.toFixed(2)}
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {summary.exchange} • Real-time data • {timeWindow} view
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[400px]">
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
            tickFormatter={(value) => value}
          />
          <YAxis
            domain={[minPrice - priceRange * 0.1, maxPrice + priceRange * 0.1]}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value, name) => [
                  `$${Number(value).toFixed(2)}`,
                  "Price",
                ]}
              />
            }
          />
          <Area
            dataKey="price"
            type="monotone"
            fill={isPositive ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))"}
            fillOpacity={0.4}
            stroke={isPositive ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))"}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>

      <div className="flex w-full items-start gap-2 text-sm">
        <div className="grid gap-2">
          <div
            className={`flex items-center gap-2 leading-none font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "Trending up" : "Trending down"} by{" "}
            {Math.abs(percentChange).toFixed(2)}%
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
          <div className="text-muted-foreground flex items-center gap-2 leading-none">
            Live market data • Updated every minute
          </div>
        </div>
      </div>

      {prediction && prediction.status === "success" && (
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-semibold text-sm">
            AI Price Prediction (Next 90 Days)
          </h4>
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {prediction.result}
            </p>
          </div>
        </div>
      )}

      <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Important Disclaimer:</strong> Stock prices are inherently
            unpredictable and subject to extreme volatility. This analysis and
            any predictions are for informational purposes only and should not
            be considered as financial advice. Past performance does not
            guarantee future results. Always consult with a qualified financial
            advisor before making investment decisions.
          </div>
        </div>
      </div>
    </div>
  );
}
