import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { HeaderContent } from "@/components/dashboard/header-content";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";

export default function TransactionsPage() {
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
              <BreadcrumbPage>Transactions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderContent />
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Transactions
              </h1>
              <p className="text-muted-foreground">
                View and manage all your financial transactions
              </p>
            </div>
            <AddTransactionDialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </AddTransactionDialog>
          </div>
          <TransactionsTable showFilters={true}/>
        </div>
      </main>
    </SidebarInset>
  );
}
