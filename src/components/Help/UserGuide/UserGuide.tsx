import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableOfContents } from "./TableOfContents";
import { GettingStarted } from "./GettingStarted";
import { UsingDashboard } from "./UsingDashboard";
import { PlanningCampaigns } from "./PlanningCampaigns";
import { CampaignManagement } from "./CampaignManagement";
import { AudienceInsights } from "./AudienceInsights";
import { OptimizationAI } from "./OptimizationAI";
import { BrandSentiment } from "./BrandSentiment";
import { AccountSettings } from "./AccountSettings";
import { HelpSupport } from "./HelpSupport";

export function UserGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold text-primary">Valkyrie User Guide</h1>
        <p className="text-xl text-muted-foreground">Your Digital Advertising Guardian</p>
        <p className="text-lg max-w-2xl mx-auto">
          Welcome to Valkyrie, the ultimate platform designed to simplify your digital advertising efforts, 
          safeguard your investment, and lead your brand to success. This user guide will walk you through 
          every feature of Valkyrie, ensuring you get the most out of the app.
        </p>
      </div>

      <TableOfContents />
      <GettingStarted />
      
      <section id="connecting-platforms" className="space-y-6">
        <h2 className="text-2xl font-semibold">2. Connecting Your Platforms</h2>
        <Card>
          <CardHeader>
            <CardTitle>Why Connect Your Platforms?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Valkyrie works best when all your advertising accounts are connected. This allows the app to 
              provide a comprehensive overview, insightful analytics, and actionable recommendations.
            </p>
            <h3 className="font-semibold mb-2">How to Connect a Platform</h3>
            <ol className="list-decimal list-inside space-y-2 mb-6">
              <li>Navigate to the Integrations tab in the menu</li>
              <li>Click Connect next to the platform you want to add</li>
              <li>Follow the on-screen instructions to authenticate and grant permissions</li>
              <li>Once connected, Valkyrie will begin syncing data</li>
            </ol>

            <div className="space-y-4">
              <h3 className="font-semibold">Platform-Specific Guides</h3>
              <p>For detailed, step-by-step instructions for each platform, refer to the guides below:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Facebook Ads Manager Guide</li>
                <li>Google Ads Manager Guide</li>
                <li>TikTok Ads Manager Guide</li>
                <li>Amazon DSP Guide</li>
              </ul>
              <p className="text-sm text-muted-foreground">(Additional guides are included in the appendix of this document.)</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <UsingDashboard />
      <PlanningCampaigns />
      <CampaignManagement />
      <AudienceInsights />
      <OptimizationAI />
      <BrandSentiment />
      <AccountSettings />
      <HelpSupport />

      <Card className="mt-12">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Thank You for Choosing Valkyrie</h2>
          <p className="mb-4">
            We're honored to be your digital advertising guardian. Together, we'll conquer the digital 
            marketing battlefield and achieve your business goals.
          </p>
          <p className="text-muted-foreground">
            For further guidance, visit{" "}
            <a href="https://www.valkyriehub.com" className="text-primary hover:underline">
              www.valkyriehub.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}