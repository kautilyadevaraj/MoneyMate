import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderContent } from "@/components/dashboard/header-content";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BudgetOverview } from "@/components/budget/budget-overview";
import { BudgetList } from "@/components/budget/budget-list";
import { CreateBudgetDialog } from "@/components/budget/create-budget-dialog";
import { BudgetAnalytics } from "@/components/budget/budget-analytics";

export default function BudgetsPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">AI Financial Assistant</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Budgets</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderContent />
      </header>

      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Budget Management
            </h1>
            <p className="text-muted-foreground">
              Create, track, and analyze your budgets to achieve your financial
              goals
            </p>
          </div>
          <CreateBudgetDialog />
        </div>

        <BudgetOverview />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <BudgetList />
          </div>
          <div>
            <BudgetAnalytics />
          </div>
        </div>
      </main>
    </SidebarInset>
  );
}
