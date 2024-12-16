import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TrendsData {
  date: string;
  spend: number;
  signups: number;
  purchases: number;
  revenue: number;
  profit: number;
}

interface CampaignTrendsChartProps {
  data: TrendsData[];
}

export function CampaignTrendsChart({ data }: CampaignTrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="spend" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="profit" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}