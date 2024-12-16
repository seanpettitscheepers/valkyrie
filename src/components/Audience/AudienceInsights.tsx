import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AudienceInsightsProps {
  data: any[];
}

export function AudienceInsights({ data }: AudienceInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Insights Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="engagement" stroke="#496946" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-muted-foreground">No data available</p>
        )}
      </CardContent>
    </Card>
  );
}