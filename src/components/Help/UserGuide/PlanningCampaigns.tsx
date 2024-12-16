import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PlanningCampaigns() {
  return (
    <section id="planning-campaigns" className="space-y-6">
      <h2 className="text-2xl font-semibold">4. Planning Campaigns</h2>

      <Card>
        <CardHeader>
          <CardTitle>Step 1: Set Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click on Campaign Planner in the menu.</li>
            <li>Select your campaign objective:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Awareness</li>
                <li>Consideration</li>
                <li>Conversion</li>
              </ul>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 2: Enter Budget and Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Input your total campaign budget.</li>
            <li>Choose which platforms you want to run your ads on (e.g., Facebook, Google Ads, TikTok).</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 3: AI-Driven Budget Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Valkyrie's AI will suggest how to allocate your budget across platforms based on your objectives 
            and past campaign performance. Review and approve the suggested breakdown or make manual adjustments.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}