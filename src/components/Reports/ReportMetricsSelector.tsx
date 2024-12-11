import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ReportMetricsSelectorProps {
  selectedMetrics: {
    performance: string[];
    audience: string[];
    sentiment: string[];
  };
  onMetricsChange: (metrics: {
    performance: string[];
    audience: string[];
    sentiment: string[];
  }) => void;
}

export function ReportMetricsSelector({
  selectedMetrics,
  onMetricsChange,
}: ReportMetricsSelectorProps) {
  const performanceMetrics = [
    { id: "spend", label: "Total Spend" },
    { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" },
    { id: "ctr", label: "CTR" },
    { id: "cpc", label: "CPC" },
    { id: "conversions", label: "Conversions" },
    { id: "cpa", label: "CPA" },
  ];

  const audienceMetrics = [
    { id: "demographics", label: "Demographics" },
    { id: "interests", label: "Interests" },
    { id: "engagement", label: "Engagement" },
  ];

  const sentimentMetrics = [
    { id: "sentiment_score", label: "Sentiment Score" },
    { id: "volume", label: "Mention Volume" },
    { id: "key_mentions", label: "Key Mentions" },
    { id: "risk_factors", label: "Risk Factors" },
  ];

  const handleMetricToggle = (category: keyof typeof selectedMetrics, metricId: string) => {
    const currentMetrics = selectedMetrics[category];
    const updatedMetrics = currentMetrics.includes(metricId)
      ? currentMetrics.filter(id => id !== metricId)
      : [...currentMetrics, metricId];

    onMetricsChange({
      ...selectedMetrics,
      [category]: updatedMetrics,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select Metrics</h3>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h4 className="font-medium mb-2">Performance Metrics</h4>
            <div className="space-y-2">
              {performanceMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`performance-${metric.id}`}
                    checked={selectedMetrics.performance.includes(metric.id)}
                    onCheckedChange={() => handleMetricToggle("performance", metric.id)}
                  />
                  <Label htmlFor={`performance-${metric.id}`}>{metric.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Audience Metrics</h4>
            <div className="space-y-2">
              {audienceMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`audience-${metric.id}`}
                    checked={selectedMetrics.audience.includes(metric.id)}
                    onCheckedChange={() => handleMetricToggle("audience", metric.id)}
                  />
                  <Label htmlFor={`audience-${metric.id}`}>{metric.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Sentiment Metrics</h4>
            <div className="space-y-2">
              {sentimentMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sentiment-${metric.id}`}
                    checked={selectedMetrics.sentiment.includes(metric.id)}
                    onCheckedChange={() => handleMetricToggle("sentiment", metric.id)}
                  />
                  <Label htmlFor={`sentiment-${metric.id}`}>{metric.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}