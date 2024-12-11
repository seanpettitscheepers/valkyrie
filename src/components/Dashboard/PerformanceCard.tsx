import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Square } from "lucide-react";

interface PerformanceCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
}

export function PerformanceCard({ title, value, change, trend }: PerformanceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Square className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{value}</div>
        <div className={`flex items-center text-xs font-medium ${
          trend === "up" ? "text-green-600" : "text-red-600"
        }`}>
          {trend === "up" ? (
            <ArrowUpRight className="mr-1 h-4 w-4 stroke-2" />
          ) : (
            <ArrowDownRight className="mr-1 h-4 w-4 stroke-2" />
          )}
          <span>{change}% from last period</span>
        </div>
      </CardContent>
    </Card>
  );
}