import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface EngagementData {
  date: string;
  sign_in: number;
  buy_product: number;
  revenue: number;
}

interface EngagementChartProps {
  data: EngagementData[];
}

export function EngagementChart({ data }: EngagementChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sign_in" stroke="#8884d8" />
              <Line type="monotone" dataKey="buy_product" stroke="#82ca9d" />
              <Line type="monotone" dataKey="revenue" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}