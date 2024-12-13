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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString()}`}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="spend"
                stroke="#FF5D8F"
                name="Ad Spend"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="signups"
                stroke="#8884d8"
                name="Signups"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="purchases"
                stroke="#82ca9d"
                name="Purchases"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#ffc658"
                name="Revenue"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="profit"
                stroke="#ff7300"
                name="Profit"
                strokeDasharray="5 5"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="spend"
                stroke="#ff0000"
                name="Break-even"
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}