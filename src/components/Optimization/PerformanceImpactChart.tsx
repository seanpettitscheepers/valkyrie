import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PerformanceImpactChartProps {
  recommendations: any[];
}

export function PerformanceImpactChart({ recommendations }: PerformanceImpactChartProps) {
  const data = recommendations.map(rec => ({
    name: rec.type,
    current: rec.performance_before?.value || 0,
    estimated: rec.performance_after?.value || 0,
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="current" name="Current" fill="#94a3b8" />
          <Bar dataKey="estimated" name="Estimated" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}