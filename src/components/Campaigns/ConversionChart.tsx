import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ConversionChartProps {
  signupsCompleted: number;
  purchasesCompleted: number;
}

export function ConversionChart({ signupsCompleted, purchasesCompleted }: ConversionChartProps) {
  const data = [
    { name: "Sign In", value: 100 },
    { name: "Purchase", value: (purchasesCompleted / signupsCompleted) * 100 || 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" name="Conversion Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}