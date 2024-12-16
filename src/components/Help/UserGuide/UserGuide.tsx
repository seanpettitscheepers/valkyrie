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
import { APIGuides } from "../APIGuides";

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
      <APIGuides />
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