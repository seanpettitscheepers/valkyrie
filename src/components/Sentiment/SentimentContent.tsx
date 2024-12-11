import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Signal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SentimentMetrics } from "./SentimentMetrics";
import { DateRange } from "react-day-picker";
import { Tables } from "@/integrations/supabase/types";

interface SentimentContentProps {
  isLoading: boolean;
  sentimentData: Tables<"brand_sentiment">[] | null;
  selectedChannel: string;
  dateRange?: DateRange;
}

export function SentimentContent({ isLoading, sentimentData, selectedChannel, dateRange }: SentimentContentProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  if (!sentimentData || sentimentData.length === 0) {
    return (
      <div className="text-center py-12">
        <Signal className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No sentiment data available</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your filters or selecting a different date range
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Showing sentiment analysis for {selectedChannel === "all" ? "all channels" : selectedChannel}
          {dateRange?.from && dateRange?.to && ` from ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`}
        </AlertDescription>
      </Alert>
      <SentimentMetrics sentimentData={sentimentData} />
    </div>
  );
}