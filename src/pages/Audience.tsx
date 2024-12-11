import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, ChartPie } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";

interface AudienceInsight {
  id: string;
  campaign_id: string;
  platform: string;
  demographics: {
    age?: { [key: string]: number };
    gender?: { [key: string]: number };
    location?: { [key: string]: number };
  };
  interests: {
    categories?: string[];
    topics?: string[];
  };
  engagement_metrics: {
    engagement_rate?: number;
    average_time_spent?: number;
  };
}

const Audience = () => {
  const { data: insights, isLoading } = useQuery({
    queryKey: ["audience-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audience_insights")
        .select("*");
      
      if (error) throw error;
      return data as AudienceInsight[];
    },
  });

  const renderDemographics = (demographics: AudienceInsight["demographics"]) => {
    return (
      <div className="space-y-4">
        {demographics.age && (
          <div>
            <h4 className="font-medium mb-2">Age Distribution</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(demographics.age).map(([range, percentage]) => (
                <div key={range} className="flex justify-between">
                  <span>{range}</span>
                  <span>{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {demographics.gender && (
          <div>
            <h4 className="font-medium mb-2">Gender Distribution</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(demographics.gender).map(([gender, percentage]) => (
                <div key={gender} className="flex justify-between">
                  <span className="capitalize">{gender}</span>
                  <span>{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInterests = (interests: AudienceInsight["interests"]) => {
    return (
      <div className="space-y-4">
        {interests.categories && (
          <div>
            <h4 className="font-medium mb-2">Interest Categories</h4>
            <div className="flex flex-wrap gap-2">
              {interests.categories.map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <h1 className="text-3xl font-bold mb-6">Audience Insights</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Audience</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2M</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.8%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interest Categories</CardTitle>
                  <ChartPie className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {insights?.map((insight) => (
                <Card key={insight.id} className="p-6">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Platform: {insight.platform}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Demographics</h3>
                      {renderDemographics(insight.demographics)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Interests</h3>
                      {renderInterests(insight.interests)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Audience;