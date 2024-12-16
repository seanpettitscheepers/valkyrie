import { PageLayout } from "@/components/Layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LaunchAdsCreatives } from "@/components/LaunchAds/LaunchAdsCreatives";
import { LaunchAdsTargeting } from "@/components/LaunchAds/LaunchAdsTargeting";
import { LaunchAdsPlatforms } from "@/components/LaunchAds/LaunchAdsPlatforms";
import { LaunchAdsBudget } from "@/components/LaunchAds/LaunchAdsBudget";
import { LaunchAdsAIRecommendations } from "@/components/LaunchAds/LaunchAdsAIRecommendations";
import { PageHeader } from "@/components/ui/page-header";

export default function LaunchAds() {
  return (
    <PageLayout title="Launch Ads">
      <div className="space-y-6">
        <PageHeader
          title="Ready, Aim, Launch: Seamless Ad Creation"
          description="Deploy your campaigns across platforms with precision. Valkyrie ensures smooth ad launches that deliver results."
        />
        <Card className="p-6">
          <Tabs defaultValue="platforms" className="space-y-6">
            <TabsList>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="creatives">Creatives</TabsTrigger>
              <TabsTrigger value="targeting">Targeting</TabsTrigger>
              <TabsTrigger value="budget">Budget & Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="platforms" className="space-y-4">
              <LaunchAdsPlatforms />
            </TabsContent>

            <TabsContent value="creatives" className="space-y-4">
              <LaunchAdsCreatives />
            </TabsContent>

            <TabsContent value="targeting" className="space-y-4">
              <LaunchAdsTargeting />
            </TabsContent>

            <TabsContent value="budget" className="space-y-4">
              <LaunchAdsBudget />
            </TabsContent>
          </Tabs>
        </Card>

        <LaunchAdsAIRecommendations />
      </div>
    </PageLayout>
  );
}
