import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ReportMetricsSelector } from "./ReportMetricsSelector";
import { ReportFilters } from "./ReportFilters";
import { ReportPreview } from "./ReportPreview";
import { ReportInsights } from "./ReportInsights";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function ReportBuilder() {
  const { toast } = useToast();
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

  const exportToPDF = async () => {
    if (!reportRef.current) return;

    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your report.",
      });

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "landscape",
        unit: "mm",
      });

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      pdf.save("campaign-report.pdf");

      toast({
        title: "PDF Generated",
        description: "Your report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
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

      {isLoading ? (
        <div>Loading report data...</div>
      ) : reportData ? (
        <>
          <div className="flex justify-end">
            <Button onClick={exportToPDF} className="gap-2">
              <FileDown className="h-4 w-4" />
              Export PDF
            </Button>
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
    </div>
  );
}