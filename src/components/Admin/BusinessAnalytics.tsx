import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { DateRangePicker } from "@/components/Reports/DateRangePicker";
import { AddCostDialog } from "./Analytics/AddCostDialog";
import { MetricsCards } from "./Analytics/MetricsCards";
import { GrowthCharts } from "./Analytics/GrowthCharts";

export function BusinessAnalytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["business-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_analytics")
        .select("*")
        .order("date", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DateRangePicker />
        <AddCostDialog />
      </div>

      <MetricsCards analytics={analytics} />

      <GrowthCharts analytics={analytics} />
    </div>
  );
}