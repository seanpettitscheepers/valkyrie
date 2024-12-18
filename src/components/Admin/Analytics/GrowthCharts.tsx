import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface GrowthChartsProps {
  analytics: {
    growth_projections: {
      userbase: any[];
      financial: any[];
    };
  };
}

export function GrowthCharts({ analytics }: GrowthChartsProps) {
  return (
    <>
      <Card className="bg-card hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Userbase Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.growth_projections?.userbase || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)' 
                  }}
                />
                <Line type="monotone" dataKey="users" stroke="var(--primary)" />
                <Line type="monotone" dataKey="projected" stroke="var(--primary)" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Revenue & Profit Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.growth_projections?.financial || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)' 
                  }}
                />
                <Bar dataKey="revenue" fill="var(--primary)" />
                <Bar dataKey="profit" fill="var(--primary-foreground)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}