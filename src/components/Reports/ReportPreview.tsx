import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceMetricsGrid } from "@/components/Performance/PerformanceMetricsGrid";
import { DemographicsCard } from "@/components/Audience/DemographicsCard";
import { InterestsCard } from "@/components/Audience/InterestsCard";
import { SentimentTrendChart } from "@/components/Sentiment/SentimentTrendChart";

interface ReportPreviewProps {
  data: {
    performanceData: any[];
    audienceData: any[];
    sentimentData: any[];
  };
  selectedMetrics: {
    performance: string[];
    audience: string[];
    sentiment: string[];
  };
}

export function ReportPreview({ data, selectedMetrics }: ReportPreviewProps) {
  const { performanceData, audienceData, sentimentData } = data;

  return (
    <div className="space-y-6">
      {selectedMetrics.performance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceMetricsGrid metrics={performanceData} />
          </CardContent>
        </Card>
      )}

      {selectedMetrics.audience.length > 0 && audienceData?.[0] && (
        <div className="grid gap-6 md:grid-cols-2">
          <DemographicsCard demographics={audienceData[0].demographics} />
          <InterestsCard interests={audienceData[0].interests} />
        </div>
      )}

      {selectedMetrics.sentiment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Brand Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <SentimentTrendChart sentimentData={sentimentData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}