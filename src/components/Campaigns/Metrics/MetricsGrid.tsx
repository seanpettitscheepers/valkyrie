import { KPIProgressCard } from "./KPIProgressCard";
import { ROICard } from "./ROICard";
import { Campaign } from "@/types/campaign";

interface MetricsGridProps {
  kpiProgress: {
    signups: { completed: number; target: number };
    purchases: { completed: number; target: number };
    revenue: { completed: number; target: number };
  };
  campaign: Campaign;
}

export function MetricsGrid({ kpiProgress, campaign }: MetricsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {Object.entries(kpiProgress).map(([key, value]) => (
        <KPIProgressCard
          key={key}
          title={key}
          completed={value.completed}
          target={value.target}
        />
      ))}
      <ROICard
        campaign={campaign}
        kpis={kpiProgress}
      />
    </div>
  );
}