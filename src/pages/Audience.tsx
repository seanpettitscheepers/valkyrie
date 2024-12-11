import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, ChartPie, MapPin, GraduationCap, Briefcase, Heart, Users2 } from "lucide-react";
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
    income?: { [key: string]: number };
    education?: { [key: string]: number };
    occupation?: { [key: string]: number };
    marital_status?: { [key: string]: number };
    family_size?: { [key: string]: number };
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

  const renderMetricCard = (title: string, value: string, icon: React.ReactNode) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  const renderDemographicSection = (
    title: string,
    data: { [key: string]: number } | undefined,
    icon: React.ReactNode
  ) => {
    if (!data) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="font-medium">{title}</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="capitalize">{key}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {value}%
                </span>
              </div>
            </div>
          ))}
        </div>
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
                  className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
        {interests.topics && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Topics</h4>
            <div className="flex flex-wrap gap-2">
              {interests.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-secondary/10 rounded-full text-sm"
                >
                  {topic}
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

  const insight = insights?.[0];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <h1 className="text-3xl font-bold mb-6">Audience Insights</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
              {renderMetricCard(
                "Total Audience",
                "1.2M",
                <Users className="h-4 w-4 text-muted-foreground" />
              )}
              {renderMetricCard(
                "Engagement Rate",
                "3.8%",
                <Target className="h-4 w-4 text-muted-foreground" />
              )}
              {renderMetricCard(
                "Interest Categories",
                insight?.interests.categories?.length.toString() || "0",
                <ChartPie className="h-4 w-4 text-muted-foreground" />
              )}
              {renderMetricCard(
                "Locations",
                Object.keys(insight?.demographics.location || {}).length.toString(),
                <MapPin className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            {insight && (
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle>Demographics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {renderDemographicSection(
                      "Age Distribution",
                      insight.demographics.age,
                      <Users className="h-4 w-4 text-muted-foreground" />
                    )}
                    {renderDemographicSection(
                      "Gender Distribution",
                      insight.demographics.gender,
                      <Users2 className="h-4 w-4 text-muted-foreground" />
                    )}
                    {renderDemographicSection(
                      "Education",
                      insight.demographics.education,
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    )}
                    {renderDemographicSection(
                      "Occupation",
                      insight.demographics.occupation,
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    )}
                    {renderDemographicSection(
                      "Marital Status",
                      insight.demographics.marital_status,
                      <Heart className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader>
                    <CardTitle>Interests & Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderInterests(insight.interests)}
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Audience;