"use client";

import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { ChartBarMultiple } from "./chart-bar-multiple";
import { ChartAreaGradient } from "./chart-area-gradient";
import { ChartAreaDefault } from "./chart-area-default";

interface CompanyAnalysisData {
  cashFlowAnalysis: {
    capitalExpenditure: number[];
    freeCashFlow: number[];
    netIncome: number[];
    operatingCashFlow: number[];
    years: number[];
  };
  financialHealth: {
    currentRatio: number[];
    debtToEquityRatio: number[];
    totalDebt: number[];
    totalEquity: number[];
    years: number[];
  };
  revenueAndProfitability: {
    grossMargin: number[];
    netMargin: number[];
    operatingMargin: number[];
    revenue: number[];
    years: number[];
  };
}

interface CompanyAnalysisChartsProps {
  ticker: string;
  data: CompanyAnalysisData;
}

export function CompanyAnalysisCharts({
  ticker,
  data,
}: CompanyAnalysisChartsProps) {
  const revenueData = data.revenueAndProfitability.years
    .map((year, index) => ({
      month: year.toString(),
      desktop: data.revenueAndProfitability.revenue[index] / 1000000000, // Revenue in billions
      mobile: data.revenueAndProfitability.grossMargin[index], // Gross margin as secondary metric
    }))
    .filter((item) => item.month !== "2020");

  const profitMarginData = data.revenueAndProfitability.years
    .map((year, index) => ({
      month: year.toString(),
      desktop: data.revenueAndProfitability.grossMargin[index],
      mobile: data.revenueAndProfitability.netMargin[index],
    }))
    .filter((item) => item.month !== "2020");

  const cashFlowData = data.cashFlowAnalysis.years
    .map((year, index) => ({
      month: year.toString(),
      desktop: data.cashFlowAnalysis.operatingCashFlow[index] / 1000000000,
      mobile: data.cashFlowAnalysis.freeCashFlow[index] / 1000000000,
    }))
    .filter((item) => item.month !== "2020");

  const debtEquityData = data.financialHealth.years
    .map((year, index) => ({
      month: year.toString(),
      desktop: data.financialHealth.totalDebt[index] / 1000000000,
      mobile: data.financialHealth.totalEquity[index] / 1000000000,
    }))
    .filter((item) => item.month !== "2020");

  const debtRatioData = data.financialHealth.years
    .map((year, index) => ({
      month: year.toString(),
      desktop: data.financialHealth.debtToEquityRatio[index],
    }))
    .filter((item) => item.month !== "2020");

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {ticker} Financial Analysis
        </h2>
        <p className="text-muted-foreground">
          3-Year Performance Overview (2021-2024)
        </p>
      </div>

      <ChartBarMultiple
        data={revenueData}
        title="Revenue & Gross Margin"
        description="Revenue in billions and gross margin percentage"
        icon={<TrendingUp className="h-4 w-4" />}
        config={{
          desktop: { label: "Revenue (Billions)", color: "var(--chart-1)" },
          mobile: { label: "Gross Margin (%)", color: "var(--chart-2)" },
        }}
      />

      <ChartAreaGradient
        data={profitMarginData}
        title="Profit Margins Trend"
        description="Gross and net margin trends over time"
        icon={<PieChart className="h-4 w-4" />}
        config={{
          desktop: { label: "Gross Margin", color: "var(--chart-1)" },
          mobile: { label: "Net Margin", color: "var(--chart-2)" },
        }}
      />

      <ChartBarMultiple
        data={cashFlowData}
        title="Cash Flow Analysis"
        description="Operating and free cash flow in billions"
        icon={<DollarSign className="h-4 w-4" />}
        config={{
          desktop: { label: "Operating Cash Flow", color: "var(--chart-1)" },
          mobile: { label: "Free Cash Flow", color: "var(--chart-2)" },
        }}
      />

      <ChartBarMultiple
        data={debtEquityData}
        title="Debt vs Equity"
        description="Total debt and equity comparison in billions"
        icon={<TrendingDown className="h-4 w-4" />}
        config={{
          desktop: { label: "Total Debt", color: "var(--chart-1)" },
          mobile: { label: "Total Equity", color: "var(--chart-2)" },
        }}
      />

      <ChartAreaDefault
        data={debtRatioData}
        title="Debt-to-Equity Ratio"
        description="Financial leverage trend over time"
        icon={<TrendingUp className="h-4 w-4" />}
        config={{
          desktop: { label: "Debt-to-Equity Ratio", color: "var(--chart-1)" },
        }}
      />
    </div>
  );
}
