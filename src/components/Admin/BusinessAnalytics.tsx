import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Loader2, Users, CreditCard, TrendingUp, Plus } from "lucide-react";
import { DateRangePicker } from "@/components/Reports/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function BusinessAnalytics() {
  const [isAddingCost, setIsAddingCost] = useState(false);
  const { toast } = useToast();

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

  const { data: subscriptionTrends } = useQuery({
    queryKey: ["subscription-trends"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(tier, name)")
        .eq("status", "active");

      if (error) throw error;

      const trends = data.reduce((acc: Record<string, number>, curr) => {
        const tier = curr.subscription_plans?.tier || "free";
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(trends).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  const handleAddCost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase
      .from('business_costs')
      .insert({
        date: formData.get('date'),
        category: formData.get('category'),
        amount: formData.get('amount'),
        description: formData.get('description')
      });

    if (error) {
      toast({
        title: "Error adding cost",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Cost added successfully",
        description: "The business cost has been recorded."
      });
      setIsAddingCost(false);
    }
  };

  const calculateChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

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
        <Dialog open={isAddingCost} onOpenChange={setIsAddingCost}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Cost
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Business Cost</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCost} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input type="date" id="date" name="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input type="number" id="amount" name="amount" required min="0" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" />
              </div>
              <Button type="submit" className="w-full">Add Cost</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{analytics?.total_users}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-4 w-4 inline mr-1" />
              {calculateChange(analytics?.total_users || 0, (analytics?.total_users || 0) - (analytics?.active_users || 0))}% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${analytics?.monthly_revenue?.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-4 w-4 inline mr-1" />
              {calculateChange(analytics?.monthly_revenue || 0, (analytics?.total_revenue || 0) / 12)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${analytics?.monthly_profit?.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-4 w-4 inline mr-1" />
              {calculateChange(analytics?.monthly_profit || 0, (analytics?.total_profit || 0) / 12)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${analytics?.total_profit?.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-4 w-4 inline mr-1" />
              {calculateChange(analytics?.total_profit || 0, (analytics?.total_revenue || 0) - (analytics?.total_profit || 0))}% total growth
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Userbase Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.growth_projections?.userbase || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)' 
                  }}
                />
                <Line type="monotone" dataKey="users" stroke="var(--primary)" />
                <Line type="monotone" dataKey="projected" stroke="var(--primary)" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Revenue & Profit Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.growth_projections?.financial || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)' 
                  }}
                />
                <Bar dataKey="revenue" fill="var(--primary)" />
                <Bar dataKey="profit" fill="var(--primary-foreground)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}