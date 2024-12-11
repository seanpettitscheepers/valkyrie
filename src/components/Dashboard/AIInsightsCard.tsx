import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightType {
  type: "success" | "warning" | "info";
  message: string;
  metric?: string;
  recommendation?: string;
}

interface AIInsightsCardProps {
  campaignType: "awareness" | "consideration" | "conversion";
  insights: InsightType[];
}

const typeIcons = {
  success: TrendingUp,
  warning: AlertCircle,
  info: Lightbulb,
};

export function AIInsightsCard({ campaignType, insights }: AIInsightsCardProps) {
  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case "awareness":
        return "bg-blue-100 text-blue-800";
      case "consideration":
        return "bg-purple-100 text-purple-800";
      case "conversion":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInsightColor = (type: InsightType["type"]) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-amber-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">AI Campaign Insights</CardTitle>
        <Badge className={cn("ml-2", getCampaignTypeColor(campaignType))}>
          <Target className="mr-1 h-4 w-4" />
          {campaignType.charAt(0).toUpperCase() + campaignType.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = typeIcons[insight.type];
            return (
              <div key={index} className="flex items-start space-x-3">
                <div className={cn("mt-1", getInsightColor(insight.type))}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{insight.message}</p>
                  {insight.metric && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Relevant metric: {insight.metric}
                    </p>
                  )}
                  {insight.recommendation && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Recommendation: {insight.recommendation}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}