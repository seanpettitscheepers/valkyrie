import { BarChart, LineChart } from "recharts";
import { Card } from "@/components/ui/card";
import { PerformanceCard } from "@/components/Dashboard/PerformanceCard";
import { Header } from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const performanceData = [
  { title: "Total Spend", value: "$12,543", change: 12, trend: "up" as const },
  { title: "Impressions", value: "1.2M", change: 8, trend: "up" as const },
  { title: "Clicks", value: "24.3K", change: -3, trend: "down" as const },
  { title: "Conversions", value: "1,543", change: 24, trend: "up" as const },
];

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {performanceData.map((data) => (
                <PerformanceCard key={data.title} {...data} />
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <h3 className="mb-4 text-lg font-semibold">Campaign Performance</h3>
                {/* Add LineChart component here */}
              </Card>
              <Card className="p-4">
                <h3 className="mb-4 text-lg font-semibold">Channel Distribution</h3>
                {/* Add BarChart component here */}
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;