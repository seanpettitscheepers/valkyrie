import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountSettings() {
  return (
    <section id="account-settings" className="space-y-6">
      <h2 className="text-2xl font-semibold">9. Account Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle>Managing Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Navigate to the Account Settings tab.</li>
            <li>View or upgrade your subscription plan.</li>
            <li>Add or remove users with varying permission levels.</li>
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}