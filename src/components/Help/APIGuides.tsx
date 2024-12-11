import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function APIGuides() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Platform Connection Guides</h2>
        <p className="text-muted-foreground">
          Learn how to connect your advertising and analytics platforms to enable automated data synchronization.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Make sure you have the necessary API credentials before attempting to connect any platform.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Google Ads</CardTitle>
            <CardDescription>Connect your Google Ads account to sync campaign data</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="prerequisites">
                <AccordionTrigger>Prerequisites</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>A Google Ads account with administrative access</li>
                    <li>Google Ads Developer Token</li>
                    <li>OAuth 2.0 credentials (Client ID and Client Secret)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="steps">
                <AccordionTrigger>Connection Steps</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Go to the Google Cloud Console</li>
                    <li>Create a new project or select an existing one</li>
                    <li>Enable the Google Ads API</li>
                    <li>Create OAuth 2.0 credentials</li>
                    <li>Set up your developer token in Google Ads</li>
                    <li>Enter these credentials in the platform Connections page</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Google Analytics</CardTitle>
            <CardDescription>Connect Google Analytics to track campaign performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="prerequisites">
                <AccordionTrigger>Prerequisites</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Google Analytics 4 property or Universal Analytics account</li>
                    <li>Admin access to the Google Analytics property</li>
                    <li>Google Cloud Platform project with Analytics API enabled</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="steps">
                <AccordionTrigger>Connection Steps</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Access your Google Analytics account</li>
                    <li>Note your Property ID (for GA4) or View ID (for Universal Analytics)</li>
                    <li>Create a service account in Google Cloud Console</li>
                    <li>Download the JSON credentials file</li>
                    <li>Add the service account email to your GA property</li>
                    <li>Enter the credentials in the platform Connections page</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meta (Facebook) Ads</CardTitle>
            <CardDescription>Connect your Meta Ads account for campaign synchronization</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="prerequisites">
                <AccordionTrigger>Prerequisites</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Facebook Business Manager account</li>
                    <li>Admin access to your ad accounts</li>
                    <li>Meta Business SDK access token</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="steps">
                <AccordionTrigger>Connection Steps</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Go to Meta for Developers</li>
                    <li>Create a new app or use an existing one</li>
                    <li>Add the Marketing API product to your app</li>
                    <li>Generate a long-lived access token</li>
                    <li>Enter the access token in the platform Connections page</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}