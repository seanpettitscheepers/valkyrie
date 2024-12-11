import { BarChart, LineChart } from "recharts";
import { Card } from "@/components/ui/card";
import { PerformanceCard } from "@/components/Dashboard/PerformanceCard";
import { Header } from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const performanceData = [
  { title: "Total Spend", value: "$12,543", change: 12, trend: "up" as const },
  { title: "CPM", value: "$4.32", change: -2, trend: "down" as const },
  { title: "Impressions", value: "1.2M", change: 8, trend: "up" as const },
  { title: "Engagements", value: "45.2K", change: 15, trend: "up" as const },
  { title: "Video Views", value: "234.5K", change: 20, trend: "up" as const },
  { title: "CPV", value: "$0.02", change: -5, trend: "down" as const },
  { title: "Clicks", value: "24.3K", change: -3, trend: "down" as const },
  { title: "CPC", value: "$0.52", change: 4, trend: "up" as const },
  { title: "Engagement Rate", value: "3.8%", change: 7, trend: "up" as const },
  { title: "VTR", value: "65%", change: 12, trend: "up" as const },
  { title: "CPCV", value: "$0.01", change: -8, trend: "down" as const },
  { title: "CTR", value: "2.1%", change: -1, trend: "down" as const },
  { title: "CPE", value: "$0.28", change: 3, trend: "up" as const },
  { title: "CPA", value: "$15.43", change: -6, trend: "down" as const },
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
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
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