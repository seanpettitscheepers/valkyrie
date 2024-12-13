import { Card } from "@/components/ui/card";
import { PerformanceCard } from "@/components/Dashboard/PerformanceCard";

interface PerformanceMetricsGridProps {
  metrics: any | null;
}

export function PerformanceMetricsGrid({ metrics }: PerformanceMetricsGridProps) {
  if (!metrics) return null;

  const metricsGroups = [
    {
      title: "Campaign Overview",
      metrics: [
        { key: "spend", title: "Total Spend" },
        { key: "impressions", title: "Impressions" },
        { key: "reach", title: "Reach" },
        { key: "clicks", title: "Clicks" },
      ],
    },
    {
      title: "Engagement Metrics",
      metrics: [
        { key: "engagements", title: "Engagements" },
        { key: "videoViews", title: "Video Views" },
        { key: "engagementRate", title: "Engagement Rate" },
        { key: "vtr", title: "View Through Rate" },
      ],
    },
    {
      title: "Cost Metrics",
      metrics: [
        { key: "cpm", title: "CPM" },
        { key: "cpc", title: "CPC" },
        { key: "cpe", title: "Cost per Engagement" },
        { key: "cpv", title: "Cost per View" },
      ],
    },
    {
      title: "Conversion Metrics",
      metrics: [
        { key: "conversions", title: "Total Conversions" },
        { key: "cpa", title: "Cost per Acquisition" },
        { key: "conversionRate", title: "Conversion Rate" },
        { key: "roas", title: "Return on Ad Spend" },
      ],
    },
  ];

  return (
    <div className="grid gap-6">
      {metricsGroups.map((group) => (
        <Card key={group.title} className="p-4">
          <h3 className="text-lg font-semibold mb-4">{group.title}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {group.metrics.map((metric) => (
              <PerformanceCard
                key={metric.key}
                title={metric.title}
                value={metrics[metric.key]?.value || "0"}
                change={Number(metrics[metric.key]?.change || 0)}
                trend={metrics[metric.key]?.trend || "up"}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}