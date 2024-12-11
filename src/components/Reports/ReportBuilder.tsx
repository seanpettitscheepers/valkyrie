import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ReportMetricsSelector } from "./ReportMetricsSelector";
import { ReportFilters } from "./ReportFilters";
import { ReportPreview } from "./ReportPreview";
import { ReportInsights } from "./ReportInsights";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";

export function ReportBuilder() {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedMetrics, setSelectedMetrics] = useState<{
    performance: string[];
    audience: string[];
    sentiment: string[];
  }>({
    performance: [],
    audience: [],
    sentiment: [],
  });

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["report-data", selectedCampaign, dateRange],
    queryFn: async () => {
      const [performanceData, audienceData, sentimentData] = await Promise.all([
        fetchPerformanceData(),
        fetchAudienceData(),
        fetchSentimentData(),
      ]);
      return { performanceData, audienceData, sentimentData };
    },
    enabled: !!selectedCampaign && !!dateRange,
  });

  const fetchPerformanceData = async () => {
    const { data, error } = await supabase
      .from("campaign_metrics")
      .select("*")
      .eq(selectedCampaign !== "all" ? "campaign_id" : "id", selectedCampaign)
      .gte("date", dateRange?.from?.toISOString() || "")
      .lte("date", dateRange?.to?.toISOString() || "");

    if (error) throw error;
    return data;
  };

  const fetchAudienceData = async () => {
    const { data, error } = await supabase
      .from("audience_insights")
      .select("*")
      .eq(selectedCampaign !== "all" ? "campaign_id" : "id", selectedCampaign);

    if (error) throw error;
    return data;
  };

  const fetchSentimentData = async () => {
    const { data, error } = await supabase
      .from("brand_sentiment")
      .select("*")
      .eq(selectedCampaign !== "all" ? "campaign_id" : "id", selectedCampaign)
      .gte("analysis_timestamp", dateRange?.from?.toISOString() || "")
      .lte("analysis_timestamp", dateRange?.to?.toISOString() || "");

    if (error) throw error;
    return data;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <ReportFilters
          selectedCampaign={selectedCampaign}
          onCampaignChange={setSelectedCampaign}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <ReportMetricsSelector
          selectedMetrics={selectedMetrics}
          onMetricsChange={setSelectedMetrics}
        />
      </Card>

      {isLoading ? (
        <div>Loading report data...</div>
      ) : reportData ? (
        <>
          <ReportPreview
            data={reportData}
            selectedMetrics={selectedMetrics}
          />
          <ReportInsights data={reportData} />
        </>
      ) : null}
    </div>
  );
}