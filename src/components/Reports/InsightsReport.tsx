import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/Reports/DateRangePicker";
import { FunnelAnalysis } from "@/components/Reports/FunnelAnalysis";
import { FlowAnalysis } from "@/components/Reports/FlowAnalysis";
import { MoreHorizontal, Save } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function InsightsReport() {
  const [analysisType, setAnalysisType] = useState<"event" | "funnel" | "flow">("event");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Insights Report</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        An insights report is a comprehensive document that provides in-depth analysis
        and valuable information on a specific topic, issue, or dataset
      </p>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">
            Analyze by{" "}
            <span className="text-primary">
              {analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}
            </span>
          </h2>
          <Tabs defaultValue="event" onValueChange={(value) => setAnalysisType(value as any)}>
            <TabsList>
              <TabsTrigger value="event">Event</TabsTrigger>
              <TabsTrigger value="funnel">Funnel</TabsTrigger>
              <TabsTrigger value="flow">Flow</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <DateRangePicker />
      </div>

      {analysisType === "funnel" && <FunnelAnalysis />}
      {analysisType === "flow" && <FlowAnalysis />}
    </div>
  );
}