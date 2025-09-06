"use client";

import { OverviewCards } from "./overview-cards";
import { TransactionsTable } from "../transactions/transactions-table";
import { InvestmentOverview } from "./investment-overview";
import { BalanceChart } from "./balance-chart";

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <OverviewCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TransactionsTable />
        <InvestmentOverview />
      </div>

      <BalanceChart />
    </div>
  );
}
