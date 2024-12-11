import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Signal, InfoIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SentimentMetrics } from "./SentimentMetrics";
import { SentimentTrendChart } from "./SentimentTrendChart";
import { DateRange } from "react-day-picker";
import { Tables } from "@/integrations/supabase/types";

interface SentimentContentProps {
  isLoading: boolean;
  sentimentData: Tables<"brand_sentiment">[] | null;
  selectedChannel: string;
  dateRange?: DateRange;
}

export function SentimentContent({ 
  isLoading, 
  sentimentData, 
  selectedChannel, 
  dateRange 
}: SentimentContentProps) {
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
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Sentiment Trends</h3>
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <p className="mb-2">This chart shows the trend of brand sentiment over time:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="text-green-600 font-medium">Positive Mentions</span>: Messages with sentiment score above 0.6</li>
              <li><span className="text-red-600 font-medium">Negative Mentions</span>: Messages with sentiment score below 0.4</li>
              <li><span className="text-slate-500 font-medium">Neutral Mentions</span>: Messages with sentiment score between 0.4 and 0.6</li>
              <li><span className="text-indigo-600 font-medium">Overall Sentiment</span>: Average sentiment score (0-1 scale)</li>
            </ul>
          </AlertDescription>
        </Alert>
        <SentimentTrendChart sentimentData={sentimentData} />
      </div>
    </div>
  );
}