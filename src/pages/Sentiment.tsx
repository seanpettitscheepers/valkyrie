import { useState } from "react";
import { DateRange } from "react-day-picker";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Signal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SentimentOverviewCard } from "@/components/Sentiment/SentimentOverviewCard";
import { SentimentFilters } from "@/components/Sentiment/SentimentFilters";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Sentiment() {
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>();

  const { data: sentimentData, isLoading } = useQuery({
    queryKey: ['brand-sentiment', selectedChannel, selectedBrand, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('brand_sentiment')
        .select('*')
        .order('analysis_timestamp', { ascending: false });
      
      if (selectedChannel !== 'all') {
        query = query.eq('platform', selectedChannel);
      }
      
      if (dateRange?.from) {
        query = query.gte('analysis_timestamp', dateRange.from.toISOString());
      }
      
      if (dateRange?.to) {
        query = query.lte('analysis_timestamp', dateRange.to.toISOString());
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Calculate overall sentiment percentage
  const calculateOverallSentiment = () => {
    if (!sentimentData?.length) return 0;
    const avgSentiment = sentimentData.reduce((acc, curr) => acc + Number(curr.sentiment_score), 0) / sentimentData.length;
    // Convert from -1 to 1 scale to 0-100%
    return Math.round(((avgSentiment + 1) / 2) * 100);
  };

  // Calculate volume change
  const calculateVolumeChange = () => {
    if (!sentimentData?.length || sentimentData.length < 2) return { change: 0, trend: 'up' as const };
    const currentVolume = sentimentData[0].volume;
    const previousVolume = sentimentData[1].volume;
    const change = Math.round(((currentVolume - previousVolume) / previousVolume) * 100);
    return {
      change,
      trend: change >= 0 ? 'up' as const : 'down' as const
    };
  };

  const volumeChange = calculateVolumeChange();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-8 max-w-7xl mx-auto">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Brand Sentiment Analysis</h1>
                <p className="text-muted-foreground mt-2">
                  Monitor and analyze brand sentiment across platforms in real-time
                </p>
              </div>

              <SentimentFilters
                selectedChannel={selectedChannel}
                selectedBrand={selectedBrand}
                dateRange={dateRange}
                onChannelChange={setSelectedChannel}
                onBrandChange={setSelectedBrand}
                onDateRangeChange={setDateRange}
              />

              {/* Overview Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <SentimentOverviewCard
                  title="Overall Sentiment"
                  value={`${calculateOverallSentiment()}%`}
                />
                <SentimentOverviewCard
                  title="Mention Volume"
                  value={sentimentData?.[0]?.volume || 0}
                  change={volumeChange.change}
                  trend={volumeChange.trend}
                />
                <SentimentOverviewCard
                  title="Risk Level"
                  value={sentimentData?.[0]?.risk_level?.toUpperCase() || 'N/A'}
                />
              </div>

              {/* Volume Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Mention Volume Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {!isLoading && sentimentData && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[...sentimentData].reverse()}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="analysis_timestamp" 
                            tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                            formatter={(value) => [value, "Volume"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="volume"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Analysis Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p>Loading sentiment data...</p>
                  ) : (
                    <div className="space-y-4">
                      {sentimentData?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">{item.platform}</p>
                            <p className="text-sm text-muted-foreground">
                              Score: {item.sentiment_score}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${
                              item.risk_level === 'low' ? 'text-green-600' :
                              item.risk_level === 'medium' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {item.risk_level.toUpperCase()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.analysis_timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}