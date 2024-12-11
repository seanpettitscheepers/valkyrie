import { PerformanceCard } from "@/components/Dashboard/PerformanceCard";
import { PerformanceMetrics } from "./usePerformanceMetrics";
import { Card } from "@/components/ui/card";

interface PerformanceMetricsGridProps {
  metrics: PerformanceMetrics | null;
}

export function PerformanceMetricsGrid({ metrics }: PerformanceMetricsGridProps) {
  if (!metrics) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Campaign Overview</h3>
        <div className="grid gap-4">
          <PerformanceCard
            title="Total Spend"
            value={metrics.spend.value}
            change={Number(metrics.spend.change)}
            trend={metrics.spend.trend}
          />
          <PerformanceCard
            title="Impressions"
            value={metrics.impressions.value}
            change={Number(metrics.impressions.change)}
            trend={metrics.impressions.trend}
          />
          <PerformanceCard
            title="Reach"
            value={metrics.reach.value}
            change={Number(metrics.reach.change)}
            trend={metrics.reach.trend}
          />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
        <div className="grid gap-4">
          <PerformanceCard
            title="Clicks"
            value={metrics.clicks.value}
            change={Number(metrics.clicks.change)}
            trend={metrics.clicks.trend}
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
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cost Metrics</h3>
        <div className="grid gap-4">
          <PerformanceCard
            title="CPM"
            value={metrics.cpm.value}
            change={Number(metrics.cpm.change)}
            trend={metrics.cpm.trend}
          />
          <PerformanceCard
            title="CPC"
            value={metrics.cpc.value}
            change={Number(metrics.cpc.change)}
            trend={metrics.cpc.trend}
          />
          <PerformanceCard
            title="CPV"
            value={metrics.cpv.value}
            change={Number(metrics.cpv.change)}
            trend={metrics.cpv.trend}
          />
          <PerformanceCard
            title="CPCV"
            value={metrics.cpcv.value}
            change={Number(metrics.cpcv.change)}
            trend={metrics.cpcv.trend}
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
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Rate Metrics</h3>
        <div className="grid gap-4">
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
            title="CTR"
            value={metrics.ctr.value}
            change={Number(metrics.ctr.change)}
            trend={metrics.ctr.trend}
          />
        </div>
      </Card>
    </div>
  );
}