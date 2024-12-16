import { PageLayout } from "@/components/Layout/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { SentimentContent } from "@/components/Sentiment/SentimentContent";
import { SentimentHeader } from "@/components/Sentiment/SentimentHeader";
import { DateRangePicker } from "@/components/Reports/DateRangePicker";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function Sentiment() {
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data: sentimentData, isLoading } = useQuery({
    queryKey: ["sentiment", selectedChannel, dateRange],
    queryFn: async () => {
      let query = supabase.from("brand_sentiment").select("*");
      
      if (selectedChannel !== "all") {
        query = query.eq("channel", selectedChannel);
      }
      
      if (dateRange?.from) {
        query = query.gte("date", dateRange.from.toISOString());
      }
      
      if (dateRange?.to) {
        query = query.lte("date", dateRange.to.toISOString());
      }
      
      const { data, error } = await query.order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <PageLayout title="Brand Sentiment">
      <div className="space-y-6">
        <PageHeader
          title="Pulse of Your Brand: Sentiment Analysis"
          description="Monitor and analyze brand sentiment across different channels. Stay ahead of trends and maintain your brand's reputation."
        />
        <div className="flex items-center justify-between">
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Channels</option>
            <option value="twitter">Twitter</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
          </select>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
        <SentimentContent
          isLoading={isLoading}
          sentimentData={sentimentData}
          selectedChannel={selectedChannel}
          dateRange={dateRange}
        />
      </div>
    </PageLayout>
  );
}