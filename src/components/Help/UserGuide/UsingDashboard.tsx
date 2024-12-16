import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UsingDashboard() {
  return (
    <section id="using-dashboard" className="space-y-6">
      <h2 className="text-2xl font-semibold">3. Using the Dashboard</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Understanding Your Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">The Unified Dashboard provides a centralized view of your campaigns. Key metrics include:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Impressions: How many times your ad was seen.</li>
            <li>Clicks: The number of times your ad was clicked.</li>
            <li>CTR (Click-Through Rate): The percentage of impressions that resulted in clicks.</li>
            <li>Conversions: Actions completed on your website, like purchases or sign-ups.</li>
            <li>ROAS (Return on Ad Spend): Your revenue compared to your ad spend.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtering and Customizing</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Use the Filters option to sort campaigns by platform, objective, or date range.</li>
            <li>Customize your view to focus on specific metrics or KPIs that matter most to you.</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}