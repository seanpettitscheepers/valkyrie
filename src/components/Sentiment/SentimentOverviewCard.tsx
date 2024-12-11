import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface SentimentOverviewCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
}

export function SentimentOverviewCard({ title, value, change, trend }: SentimentOverviewCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && trend && (
          <div className={`flex items-center text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? (
              <ArrowUpRight className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDownRight className="mr-1 h-4 w-4" />
            )}
            {change}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}