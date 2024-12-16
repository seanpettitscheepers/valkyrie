import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ConversionChartProps {
  signupsCompleted: number;
  purchasesCompleted: number;
}

export function ConversionChart({ signupsCompleted, purchasesCompleted }: ConversionChartProps) {
  const data = [
    {
      name: "Signups",
      value: signupsCompleted,
    },
    {
      name: "Purchases",
      value: purchasesCompleted,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}