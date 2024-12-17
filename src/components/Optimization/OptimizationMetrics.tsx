import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OptimizationMetricsProps {
  recommendations: any[];
}

export function OptimizationMetrics({ recommendations }: OptimizationMetricsProps) {
  const data = [
    { name: "Targeting", value: recommendations?.filter(r => r.type === 'targeting').length || 0 },
    { name: "Budget", value: recommendations?.filter(r => r.type === 'budget').length || 0 },
    { name: "Creative", value: recommendations?.filter(r => r.type === 'creative').length || 0 },
    { name: "Platform", value: recommendations?.filter(r => r.type === 'platform_specific').length || 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}