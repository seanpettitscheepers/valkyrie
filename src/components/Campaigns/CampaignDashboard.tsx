import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, MoreHorizontal, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { CampaignFilter } from "./CampaignFilter";
import { KPIProgressCard } from "./KPIProgressCard";
import { ShareDialog } from "../Share/ShareDialog";

export function CampaignDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Fetch performance metrics
  const { data: performanceData } = useQuery({
    queryKey: ["campaign-metrics", selectedCampaign],
    queryFn: async () => {
      let query = supabase.from("campaign_metrics").select("*");
      
      if (selectedCampaign !== "all") {
        query = query.eq("campaign_id", selectedCampaign);
      }
      
      const { data, error } = await query.order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Fetch custom KPIs
  const { data: customKPIs } = useQuery({
    queryKey: ["custom-kpis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_kpis")
        .select("*")
        .eq("is_active", true);
      
      if (error) throw error;
      return data;
    },
  });

  // Calculate KPI progress
  const kpiProgress = {
    signups: {
      completed: performanceData?.reduce((sum, d) => sum + (d.impressions || 0), 0) || 0,
      target: customKPIs?.find(k => k.metric_name === "signups")?.target_value || 10000,
    },
    purchases: {
      completed: performanceData?.reduce((sum, d) => sum + (d.conversions || 0), 0) || 0,
      target: customKPIs?.find(k => k.metric_name === "purchases")?.target_value || 1000,
    },
    revenue: {
      completed: performanceData?.reduce((sum, d) => sum + (d.spend || 0), 0) || 0,
      target: customKPIs?.find(k => k.metric_name === "revenue")?.target_value || 20000,
    },
  };

  // Process engagement data for the chart
  const engagementData = performanceData?.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    sign_in: Math.round(d.impressions * 0.1),
    buy_product: d.conversions,
    revenue: d.spend,
  })) || [];

  return (
    <div className="space-y-8 p-6" ref={dashboardRef}>
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
          <div className="flex items-center gap-4">
            <CampaignFilter
              selectedCampaign={selectedCampaign}
              onCampaignChange={setSelectedCampaign}
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <ShareDialog contentRef={dashboardRef} pageTitle="Campaign Dashboard" />
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
          <KPIProgressCard
            key={key}
            title={key}
            completed={value.completed}
            target={value.target}
          />
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
                { name: "Sign In", value: 100 },
                { name: "Purchase", value: (kpiProgress.purchases.completed / kpiProgress.signups.completed) * 100 || 0 },
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
    </div>
  );
}
