import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GettingStarted() {
  return (
    <section id="getting-started" className="space-y-6">
      <h2 className="text-2xl font-semibold">1. Getting Started</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Creating Your Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>Visit www.valkyriehub.com</li>
            <li>Click Sign Up</li>
            <li>Enter your email, create a password, and fill in your business details</li>
            <li>Choose your pricing plan (you can start with the free trial)</li>
            <li>Verify your email address and log in to the app</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigating the Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Once logged in, you'll land on Valkyrie's Unified Dashboard. Here's what you'll see:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Performance Overview: A snapshot of your campaigns across all connected platforms</li>
            <li>Navigation Menu: Access key features like Campaign Planning, Audience Insights, and Settings</li>
            <li>Alerts & Recommendations: Notifications from Valkyrie, including AI-driven optimization tips</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}