import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PlatformGuide } from "./PlatformGuide";

const platformGuides = [
  {
    platform: "Facebook & Instagram",
    steps: [
      {
        title: "Create a Facebook App",
        instructions: [
          "Visit the Facebook for Developers website.",
          "Log in with your Facebook account.",
          "Click \"My Apps\" in the top-right corner and select \"Create App\".",
          "Choose the app type \"Business\", then click \"Next\".",
          "Fill in the required details (e.g., App Name, Contact Email) and click \"Create App\".",
        ],
      },
      {
        title: "Get API Credentials",
        instructions: [
          "Navigate to Settings > Basic within your Facebook App dashboard.",
          "Copy the App ID and App Secret.",
          "Under App Domains, add valkyrie.com (replace with your actual domain).",
        ],
      },
      {
        title: "Enable Permissions",
        instructions: [
          "Go to Add Product and enable the Marketing API.",
          "Generate a User Access Token with the required permissions (ads_read, ads_management, etc.).",
        ],
      },
      {
        title: "Connect to Valkyrie",
        instructions: [
          "In Valkyrie, go to Integrations > Facebook & Instagram.",
          "Paste the App ID, App Secret, and Access Token.",
          "Click Connect.",
        ],
      },
    ],
  },
  {
    platform: "Google Ads",
    steps: [
      {
        title: "Access Your Google Ads API",
        instructions: [
          "Go to the Google Ads API Console.",
          "Select an existing project or create a new one.",
          "Enable the Google Ads API by searching for it in the API Library.",
        ],
      },
      {
        title: "Get API Credentials",
        instructions: [
          "Go to Credentials > Create Credentials.",
          "Select OAuth 2.0 Client IDs and follow the instructions to generate credentials.",
          "Note the Client ID and Client Secret.",
        ],
      },
      {
        title: "Set Up a Developer Token",
        instructions: [
          "Log in to your Google Ads Account.",
          "Navigate to Tools & Settings > Setup > API Center.",
          "Request a developer token (it might take a few days for Google to approve).",
        ],
      },
      {
        title: "Connect to Valkyrie",
        instructions: [
          "In Valkyrie, go to Integrations > Google Ads.",
          "Enter your Client ID, Client Secret, and Developer Token.",
          "Authenticate and connect.",
        ],
      },
    ],
  },
  {
    platform: "TikTok Ads",
    steps: [
      {
        title: "Create a TikTok Developer Account",
        instructions: [
          "Visit the TikTok Developers website.",
          "Log in with your TikTok account.",
          "Click My Apps and select Create App.",
        ],
      },
      {
        title: "Get API Credentials",
        instructions: [
          "In your TikTok Developer dashboard, locate your app and go to Settings.",
          "Copy the App ID and App Secret.",
          "Under Redirect URL, enter https://app.valkyrie.com/auth/tiktok (replace with your actual redirect URL).",
        ],
      },
      {
        title: "Authorize Permissions",
        instructions: [
          "Grant access to the required permissions for ads and audience data.",
        ],
      },
      {
        title: "Connect to Valkyrie",
        instructions: [
          "In Valkyrie, go to Integrations > TikTok Ads.",
          "Paste your App ID and App Secret.",
          "Click Connect and follow the authentication steps.",
        ],
      },
    ],
  },
  {
    platform: "LinkedIn Ads",
    steps: [
      {
        title: "Register Your Application",
        instructions: [
          "Go to the LinkedIn Developer Portal.",
          "Log in with your LinkedIn account.",
          "Click Create App and fill in the required details.",
        ],
      },
      {
        title: "Generate API Credentials",
        instructions: [
          "Navigate to Auth > API Keys.",
          "Copy the Client ID and Client Secret.",
          "Under Redirect URLs, add https://app.valkyrie.com/auth/linkedin.",
        ],
      },
      {
        title: "Enable Marketing Permissions",
        instructions: [
          "Go to Products and enable the Marketing Developer Platform.",
          "Apply for permissions like ads_read and ads_management.",
        ],
      },
      {
        title: "Connect to Valkyrie",
        instructions: [
          "In Valkyrie, go to Integrations > LinkedIn Ads.",
          "Enter your Client ID and Client Secret.",
          "Click Connect and authenticate.",
        ],
      },
    ],
  },
  {
    platform: "Twitter (X) Ads",
    steps: [
      {
        title: "Create a Twitter Developer Account",
        instructions: [
          "Visit the Twitter Developer Portal.",
          "Sign up for a developer account and create a project.",
        ],
      },
      {
        title: "Get API Keys",
        instructions: [
          "Go to your project dashboard and create an App.",
          "Copy the API Key, API Secret Key, Bearer Token, and Access Token.",
        ],
      },
      {
        title: "Set Up Ads Permissions",
        instructions: [
          "Request ads permissions from Twitter via the developer portal.",
        ],
      },
      {
        title: "Connect to Valkyrie",
        instructions: [
          "In Valkyrie, go to Integrations > Twitter Ads.",
          "Enter your API Key, API Secret Key, and Bearer Token.",
          "Click Connect.",
        ],
      },
    ],
  },
  {
    platform: "Amazon DSP",
    steps: [
      {
        title: "Contact Amazon Advertising",
        instructions: [
          "Visit the Amazon Advertising API.",
          "Apply for access to the DSP API via your Amazon account manager.",
        ],
      },
      {
        title: "Get API Credentials",
        instructions: [
          "Once approved, generate your Client ID and Client Secret.",
          "Note your Profile ID for campaign targeting.",
        ],
      },
      {
        title: "Connect to Valkyrie",
        instructions: [
          "In Valkyrie, go to Integrations > Amazon DSP.",
          "Enter your Client ID, Client Secret, and Profile ID.",
          "Authenticate and connect.",
        ],
      },
    ],
  },
  {
    platform: "Spotify Ads",
    steps: [
      {
        title: "Access Spotify Ad Studio",
        instructions: [
          "Visit Spotify Ad Studio.",
          "Log in with your Spotify account.",
        ],
      },
      {
        title: "Get API Credentials",
        instructions: [
          "Go to the Spotify for Developers portal.",
          "Create a new app and generate your Client ID and Client Secret.",
        ],
      },
      {
        title: "Connect to Valkyrie",
        instructions: [
          "In Valkyrie, go to Integrations > Spotify Ads.",
          "Enter your Client ID and Client Secret.",
          "Authenticate and connect.",
        ],
      },
    ],
  },
  {
    platform: "YouTube Ads",
    steps: [
      {
        title: "Enable YouTube API",
        instructions: [
          "Visit the Google API Console.",
          "Select your project and enable the YouTube Data API.",
        ],
      },
      {
        title: "Get API Credentials",
        instructions: [
          "Go to Credentials > Create Credentials.",
          "Select OAuth 2.0 Client IDs and generate your Client ID and Client Secret.",
        ],
      },
      {
        title: "Connect to Valkyrie",
        instructions: [
          "In Valkyrie, go to Integrations > YouTube Ads.",
          "Enter your Client ID and Client Secret.",
          "Authenticate and connect.",
        ],
      },
    ],
  },
];

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
          If you encounter any issues during setup, please contact our support team at support@valkyrie.com or use the in-app live chat for assistance.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {platformGuides.map((guide) => (
          <PlatformGuide key={guide.platform} {...guide} />
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Additional Platforms</h3>
        <p>
          For additional platforms like Reddit, DV360, The Trade Desk, and Pinterest, the connection process is similar:
        </p>
        <ol className="list-decimal pl-6 mt-2 space-y-1">
          <li>Access their developer portals.</li>
          <li>Generate API credentials (Client ID, Secret, Tokens).</li>
          <li>Authorize Valkyrie to access your account.</li>
        </ol>
      </div>
    </div>
  );
}