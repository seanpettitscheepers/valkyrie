import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PerformanceCard } from "@/components/Dashboard/PerformanceCard";
import { AIInsightsCard } from "@/components/Dashboard/AIInsightsCard";
import { Header } from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const campaigns = [
  { id: "1", name: "Summer Sale 2024" },
  { id: "2", name: "Spring Collection Launch" },
  { id: "3", name: "Easter Promotion" },
  { id: "4", name: "Mother's Day Special" },
  { id: "5", name: "Back to School Campaign" },
];

const mockInsights = [
  {
    type: "success" as const,
    message: "Strong video completion rate indicates engaging content",
    metric: "VTR: 65%",
    recommendation: "Consider increasing video ad budget allocation",
  },
  {
    type: "warning" as const,
    message: "CPC is higher than industry benchmark",
    metric: "CPC: $0.52",
    recommendation: "Review targeting settings and ad relevance to improve quality score",
  },
  {
    type: "info" as const,
    message: "Engagement rate shows strong audience interest",
    metric: "Engagement Rate: 3.8%",
    recommendation: "Test similar audiences to scale reach while maintaining engagement",
  },
];

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-6 flex flex-wrap gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {performanceData.map((data) => (
                <PerformanceCard key={data.title} {...data} />
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <h3 className="mb-4 text-lg font-semibold">
                  Campaign Performance
                </h3>
                {/* Add LineChart component here */}
              </Card>
              <Card className="p-4">
                <h3 className="mb-4 text-lg font-semibold">
                  Channel Distribution
                </h3>
                {/* Add BarChart component here */}
              </Card>
            </div>

            <div className="mt-6">
              <AIInsightsCard campaignType="consideration" insights={mockInsights} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
