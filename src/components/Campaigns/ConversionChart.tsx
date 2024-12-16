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
              <CartesianGrid strokeDasharray="3 3" stroke="#C2B8B0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: "#1F1E1B" }}
                axisLine={{ stroke: "#858071" }}
              />
              <YAxis 
                tick={{ fill: "#1F1E1B" }}
                axisLine={{ stroke: "#858071" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#EBE5D5",
                  border: "1px solid #C2B8B0",
                  borderRadius: "0.5rem",
                  color: "#1F1E1B"
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, "Conversion Rate"]}
              />
              <Bar 
                dataKey="value" 
                fill="#496946" 
                radius={[4, 4, 0, 0]}
                onMouseEnter={(data, index) => {
                  console.log('Bar hover:', data, index);
                }}
                name="Conversion Rate %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}