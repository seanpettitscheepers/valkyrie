import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TrendsData {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
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
              <Area 
                type="monotone" 
                dataKey="spend" 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Spend"
              />
              <Area 
                type="monotone" 
                dataKey="impressions" 
                stackId="1" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                name="Impressions"
              />
              <Area 
                type="monotone" 
                dataKey="clicks" 
                stackId="1" 
                stroke="#ffc658" 
                fill="#ffc658" 
                name="Clicks"
              />
              <Area 
                type="monotone" 
                dataKey="conversions" 
                stackId="1" 
                stroke="#ff8042" 
                fill="#ff8042" 
                name="Conversions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}