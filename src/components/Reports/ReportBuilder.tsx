import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ReportMetricsSelector } from "./ReportMetricsSelector";
import { ReportFilters } from "./ReportFilters";
import { ReportPreview } from "./ReportPreview";
import { ReportInsights } from "./ReportInsights";
import { ReportExportButton } from "./ReportExportButton";
import { ReportLoadingState } from "./ReportLoadingState";
import { InsightsReport } from "./InsightsReport";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ReportBuilder() {
  const reportRef = useRef<HTMLDivElement>(null);
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
  const [analysisType, setAnalysisType] = useState<"event" | "funnel" | "flow">("event");

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
    let query = supabase
      .from("campaign_metrics")
      .select("*");

    if (selectedCampaign !== "all") {
      query = query.eq("campaign_id", selectedCampaign);
    }

    if (dateRange?.from) {
      query = query.gte("date", dateRange.from.toISOString().split('T')[0]);
    }

    if (dateRange?.to) {
      query = query.lte("date", dateRange.to.toISOString().split('T')[0]);
    }

    const { data, error } = await query;
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
    let query = supabase
      .from("brand_sentiment")
      .select("*");

    if (selectedCampaign !== "all") {
      query = query.eq("campaign_id", selectedCampaign);
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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Card className="p-6 w-full">
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
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insights">Insights Report</TabsTrigger>
          <TabsTrigger value="custom">Custom Report</TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          <InsightsReport />
        </TabsContent>

        <TabsContent value="custom">
          {isLoading ? (
            <ReportLoadingState />
          ) : reportData ? (
            <>
              <div className="flex justify-end">
                <ReportExportButton reportRef={reportRef} />
              </div>
              <div ref={reportRef}>
                <ReportPreview
                  data={reportData}
                  selectedMetrics={selectedMetrics}
                />
                <ReportInsights data={reportData} />
              </div>
            </>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}