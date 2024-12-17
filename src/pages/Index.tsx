import { PageLayout } from "@/components/Layout/PageLayout";
import { FacebookPagesManager } from "@/components/Integrations/Facebook/FacebookPagesManager";
import { GoogleAdsIntegration } from "@/components/Integrations/GoogleAds/GoogleAdsIntegration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook } from "lucide-react";
import { SubscriptionLimits } from "@/components/Account/SubscriptionLimits";

export default function Index() {
  return (
    <PageLayout title="Dashboard">
      <div className="space-y-6">
        <SubscriptionLimits />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Facebook className="h-5 w-5" />
              Facebook Pages
            </CardTitle>
            <CardDescription>
              Connect and manage your Facebook Pages to track engagement and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FacebookPagesManager />
          </CardContent>
        </Card>

        <GoogleAdsIntegration />
      </div>
    </PageLayout>
  );
}