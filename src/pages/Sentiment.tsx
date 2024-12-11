import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { SentimentFilters } from "@/components/Sentiment/SentimentFilters";
import { SentimentOverviewCard } from "@/components/Sentiment/SentimentOverviewCard";
import { Signal, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      );
    }

    if (!sentimentData || sentimentData.length === 0) {
      return (
        <div className="text-center py-12">
          <Signal className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No sentiment data available</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or selecting a different date range
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Showing sentiment analysis for {selectedChannel === "all" ? "all channels" : selectedChannel}
            {dateRange?.from && dateRange?.to && ` from ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`}
          </AlertDescription>
        </Alert>
        <SentimentOverviewCard data={sentimentData} />
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Brand Sentiment Analysis</h1>
              <p className="text-muted-foreground mt-1">
                Monitor and analyze brand sentiment across different channels and time periods
              </p>
            </div>

            <SentimentFilters
              onChannelChange={setSelectedChannel}
              onBrandChange={setSelectedBrand}
              onDateRangeChange={setDateRange}
              selectedChannel={selectedChannel}
              selectedBrand={selectedBrand}
              dateRange={dateRange}
            />

            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Sentiment;