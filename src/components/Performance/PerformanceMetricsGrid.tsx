import { PerformanceCard } from "@/components/Dashboard/PerformanceCard";

interface PerformanceMetric {
  value: string;
  trend: "up" | "down";
  change: number;
}

interface PerformanceMetrics {
  spend: PerformanceMetric;
  cpm: PerformanceMetric;
  engagements: PerformanceMetric;
  videoViews: PerformanceMetric;
  cpv: PerformanceMetric;
  cpc: PerformanceMetric;
  engagementRate: PerformanceMetric;
  vtr: PerformanceMetric;
  cpcv: PerformanceMetric;
  ctr: PerformanceMetric;
  cpe: PerformanceMetric;
  cpa: PerformanceMetric;
}

interface PerformanceMetricsGridProps {
  metrics: PerformanceMetrics | null;
}

export function PerformanceMetricsGrid({ metrics }: PerformanceMetricsGridProps) {
  if (!metrics) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <PerformanceCard
        title="Total Spend"
        value={metrics.spend.value}
        change={Number(metrics.spend.change)}
        trend={metrics.spend.trend}
      />
      
      <PerformanceCard
        title="CPM"
        value={metrics.cpm.value}
        change={Number(metrics.cpm.change)}
        trend={metrics.cpm.trend}
      />

      <PerformanceCard
        title="Engagements"
        value={metrics.engagements.value}
        change={Number(metrics.engagements.change)}
        trend={metrics.engagements.trend}
      />

      <PerformanceCard
        title="Video Views"
        value={metrics.videoViews.value}
        change={Number(metrics.videoViews.change)}
        trend={metrics.videoViews.trend}
      />

      <PerformanceCard
        title="CPV"
        value={metrics.cpv.value}
        change={Number(metrics.cpv.change)}
        trend={metrics.cpv.trend}
      />

      <PerformanceCard
        title="CPC"
        value={metrics.cpc.value}
        change={Number(metrics.cpc.change)}
        trend={metrics.cpc.trend}
      />

      <PerformanceCard
        title="Engagement Rate"
        value={metrics.engagementRate.value}
        change={Number(metrics.engagementRate.change)}
        trend={metrics.engagementRate.trend}
      />

      <PerformanceCard
        title="VTR"
        value={metrics.vtr.value}
        change={Number(metrics.vtr.change)}
        trend={metrics.vtr.trend}
      />

      <PerformanceCard
        title="CPCV"
        value={metrics.cpcv.value}
        change={Number(metrics.cpcv.change)}
        trend={metrics.cpcv.trend}
      />

      <PerformanceCard
        title="CTR"
        value={metrics.ctr.value}
        change={Number(metrics.ctr.change)}
        trend={metrics.ctr.trend}
      />

      <PerformanceCard
        title="CPE"
        value={metrics.cpe.value}
        change={Number(metrics.cpe.change)}
        trend={metrics.cpe.trend}
      />

      <PerformanceCard
        title="CPA"
        value={metrics.cpa.value}
        change={Number(metrics.cpa.change)}
        trend={metrics.cpa.trend}
      />
    </div>
  );
}