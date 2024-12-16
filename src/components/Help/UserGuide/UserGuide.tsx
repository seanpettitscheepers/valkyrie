import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableOfContents } from "./TableOfContents";
import { GettingStarted } from "./GettingStarted";

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
            <ol className="list-decimal list-inside space-y-2">
              <li>Navigate to the Integrations tab in the menu</li>
              <li>Click Connect next to the platform you want to add</li>
              <li>Follow the on-screen instructions to authenticate and grant permissions</li>
              <li>Once connected, Valkyrie will begin syncing data</li>
            </ol>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}