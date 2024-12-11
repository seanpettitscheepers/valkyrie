import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Signal, AlertCircle, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Sentiment() {
  const { data: sentimentData, isLoading } = useQuery({
    queryKey: ['brand-sentiment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_sentiment')
        .select('*')
        .order('analysis_timestamp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-8 max-w-7xl mx-auto">
            <div className="space-y-8">
              {/* Header Section */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Brand Sentiment Analysis</h1>
                <p className="text-muted-foreground mt-2">
                  Monitor and analyze brand sentiment across platforms in real-time
                </p>
              </div>

              {/* Overview Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overall Sentiment</CardTitle>
                    <Signal className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Positive</div>
                    <p className="text-xs text-muted-foreground">
                      Based on latest analysis
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Low</div>
                    <p className="text-xs text-muted-foreground">
                      Current risk assessment
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mention Volume</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">
                      Last 24 hours
                    </p>
                  </CardContent>
                </Card>
              </div>

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