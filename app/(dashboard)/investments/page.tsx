import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { InvestmentOverview } from "@/components/dashboard/investment-overview";
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

export default function InvestmentsPage() {
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
              <BreadcrumbPage>Investments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderContent />
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
            <p className="text-muted-foreground">
              Track your investment portfolio and performance
            </p>
          </div>
          <InvestmentOverview />
        </div>
      </main>
    </SidebarInset>
  );
}
