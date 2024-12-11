import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

interface SentimentTrendChartProps {
  sentimentData: Tables<"brand_sentiment">[];
}

interface ChartDataPoint {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  overall: number;
}

export function SentimentTrendChart({ sentimentData }: SentimentTrendChartProps) {
  const processData = (): ChartDataPoint[] => {
    const sortedData = [...sentimentData].sort(
      (a, b) => 
        new Date(a.analysis_timestamp || "").getTime() - 
        new Date(b.analysis_timestamp || "").getTime()
    );

    return sortedData.map(item => {
      const score = Number(item.sentiment_score);
      return {
        date: format(new Date(item.analysis_timestamp || ""), "MMM dd"),
        positive: score > 0.6 ? item.volume : 0,
        negative: score < 0.4 ? item.volume : 0,
        neutral: score >= 0.4 && score <= 0.6 ? item.volume : 0,
        overall: Number(score.toFixed(2)),
      };
    });
  };

  const data = processData();

  return (
    <div className="w-full h-[400px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="positive"
            stroke="#22c55e"
            name="Positive Mentions"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="negative"
            stroke="#ef4444"
            name="Negative Mentions"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="neutral"
            stroke="#94a3b8"
            name="Neutral Mentions"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="overall"
            stroke="#6366f1"
            name="Overall Sentiment"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}