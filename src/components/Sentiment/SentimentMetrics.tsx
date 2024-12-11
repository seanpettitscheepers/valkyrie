import React from "react";
import { SentimentOverviewCard } from "./SentimentOverviewCard";
import { Tables } from "@/integrations/supabase/types";

interface SentimentMetricsProps {
  sentimentData: Tables<"brand_sentiment">[];
}

export function SentimentMetrics({ sentimentData }: SentimentMetricsProps) {
  const calculateAverageSentiment = () => {
    if (!sentimentData || sentimentData.length === 0) return 0;
    const total = sentimentData.reduce((sum, item) => sum + Number(item.sentiment_score), 0);
    return (total / sentimentData.length).toFixed(2);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <SentimentOverviewCard
        title="Average Sentiment Score"
        value={calculateAverageSentiment()}
        change={5}
        trend="up"
      />
      <SentimentOverviewCard
        title="Total Mentions"
        value={sentimentData.length}
        change={10}
        trend="up"
      />
      <SentimentOverviewCard
        title="Risk Level"
        value={sentimentData[0]?.risk_level || "Low"}
      />
    </div>
  );
}