import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { SentimentFilters } from "@/components/Sentiment/SentimentFilters";
import { SentimentHeader } from "@/components/Sentiment/SentimentHeader";
import { SentimentContent } from "@/components/Sentiment/SentimentContent";

const Sentiment = () => {
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data: sentimentData, isLoading } = useQuery({
    queryKey: ["sentiment", selectedChannel, selectedBrand, dateRange],
    queryFn: async () => {
      let query = supabase.from("brand_sentiment").select("*");

      if (selectedChannel !== "all") {
        query = query.eq("platform", selectedChannel);
      }

      if (dateRange?.from) {
        query = query.gte("analysis_timestamp", dateRange.from.toISOString());
      }

      if (dateRange?.to) {
        query = query.lte("analysis_timestamp", dateRange.to.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <SentimentHeader />
            <SentimentFilters
              onChannelChange={setSelectedChannel}
              onBrandChange={setSelectedBrand}
              onDateRangeChange={setDateRange}
              selectedChannel={selectedChannel}
              selectedBrand={selectedBrand}
              dateRange={dateRange}
            />
            <SentimentContent
              isLoading={isLoading}
              sentimentData={sentimentData}
              selectedChannel={selectedChannel}
              dateRange={dateRange}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Sentiment;