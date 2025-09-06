import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
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

export default function Dashboard() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <HeaderContent />
      </header>

      <main className="flex-1 overflow-auto p-6">
        <DashboardOverview />
      </main>
    </SidebarInset>
  );
}
