import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AudienceInsights() {
  return (
    <section id="audience-insights" className="space-y-6">
      <h2 className="text-2xl font-semibold">6. Audience Insights</h2>

      <Card>
        <CardHeader>
          <CardTitle>Accessing Audience Data</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Navigate to the Audience Insights tab.</li>
            <li>View reports on:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Audience demographics (age, gender, location)</li>
                <li>Interests and behaviors</li>
                <li>Performance of different audience segments</li>
              </ul>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Using Insights for Future Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Leverage these insights when planning campaigns to target the most responsive audiences.</li>
            <li>Valkyrie will highlight trends and recommend new targeting strategies based on audience behavior.</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}