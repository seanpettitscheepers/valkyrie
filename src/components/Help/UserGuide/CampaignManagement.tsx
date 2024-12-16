import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CampaignManagement() {
  return (
    <section id="campaign-management" className="space-y-6">
      <h2 className="text-2xl font-semibold">5. Campaign Management</h2>

      <Card>
        <CardHeader>
          <CardTitle>Creating Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to the Campaigns tab and click Create New Campaign.</li>
            <li>Select the platform(s) and input the campaign details:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Campaign name</li>
                <li>Objective</li>
                <li>Budget</li>
                <li>Targeting options (e.g., demographics, interests, keywords)</li>
              </ul>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applying Naming Taxonomies</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Valkyrie ensures all campaigns adhere to a standardized naming convention for clarity and 
            organization. Simply input key details, and Valkyrie will generate the naming taxonomy automatically.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}