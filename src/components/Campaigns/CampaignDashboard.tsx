import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Filter, Share2, MoreHorizontal, Plus } from "lucide-react";

export function CampaignDashboard() {
  // Fetch performance metrics
  const { data: performanceData } = useQuery({
    queryKey: ["campaign-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaign_metrics")
        .select("*")
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Fetch audience data
  const { data: audienceData } = useQuery({
    queryKey: ["audience-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audience_insights")
        .select("*");
      if (error) throw error;
      return data?.[0];
    },
  });

  // Fetch sentiment data
  const { data: sentimentData } = useQuery({
    queryKey: ["brand-sentiment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_sentiment")
        .select("*")
        .order("analysis_timestamp", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Process engagement data for the chart
  const engagementData = performanceData?.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    sign_in: Math.round(d.impressions * 0.1),
    buy_product: d.conversions,
    revenue: d.spend,
  })) || [];

  // Calculate KPI progress
  const kpiProgress = {
    signups: {
      completed: performanceData?.reduce((sum, d) => sum + (d.impressions || 0), 0) || 0,
      target: 10000,
    },
    purchases: {
      completed: performanceData?.reduce((sum, d) => sum + (d.conversions || 0), 0) || 0,
      target: 10000,
    },
    revenue: {
      completed: performanceData?.reduce((sum, d) => sum + (d.spend || 0), 0) || 0,
      target: 20000,
    },
  };

  // Calculate conversion rates
  const conversionData = {
    signIn: 100,
    purchase: (kpiProgress.purchases.completed / kpiProgress.signups.completed) * 100 || 0,
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Marketing's KPI</h1>
            <p className="text-muted-foreground mt-1">
              Key Performance Indicators (KPIs) are specific, measurable metrics that
              organizations use to track and evaluate their performance in various areas of their
              business
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* User Engagements Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Engagements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="sign_in" stroke="#8884d8" name="Sign In" />
                <Line yAxisId="left" type="monotone" dataKey="buy_product" stroke="#82ca9d" name="Purchase" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ffc658" name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* KPI Progress */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(kpiProgress).map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="capitalize">{key}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={(value.completed / value.target) * 100} />
                <div className="flex justify-between text-sm">
                  <span>Completed: {value.completed.toLocaleString()}</span>
                  <span>Target: {value.target.toLocaleString()}</span>
                </div>
                <div className="text-lg font-semibold">
                  {Math.round((value.completed / value.target) * 100)}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversion Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Sign In", value: conversionData.signIn },
                { name: "Purchase", value: conversionData.purchase },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" name="Conversion Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Retention Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Retention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData?.map(d => ({
                date: new Date(d.analysis_timestamp).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                retention: d.sentiment_score * 100,
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="retention" stroke="#8884d8" name="Retention %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}