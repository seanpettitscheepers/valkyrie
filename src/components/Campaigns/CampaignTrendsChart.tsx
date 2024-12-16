import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CampaignTrendsChartProps {
  data: Array<{
    date: string;
    spend: number;
    signups: number;
    purchases: number;
    revenue: number;
    profit: number;
  }>;
}

export function CampaignTrendsChart({ data }: CampaignTrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#C2B8B0" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: "#1F1E1B" }}
                axisLine={{ stroke: "#858071" }}
              />
              <YAxis 
                yAxisId="left" 
                tick={{ fill: "#1F1E1B" }}
                axisLine={{ stroke: "#858071" }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fill: "#1F1E1B" }}
                axisLine={{ stroke: "#858071" }}
              />
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString()}`}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ 
                  backgroundColor: "#EBE5D5",
                  border: "1px solid #C2B8B0",
                  borderRadius: "0.5rem",
                  color: "#1F1E1B"
                }}
              />
              <Legend 
                formatter={(value) => <span style={{ color: "#1F1E1B" }}>{value}</span>}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="spend"
                stroke="#496946"
                name="Ad Spend"
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="signups"
                stroke="#858071"
                name="Signups"
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="purchases"
                stroke="#C2B8B0"
                name="Purchases"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#6A665A"
                name="Revenue"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="profit"
                stroke="#2C402C"
                name="Profit"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="spend"
                stroke="#EBE5D5"
                name="Break-even"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}