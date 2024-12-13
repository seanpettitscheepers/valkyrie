import { PlatformGuide } from "./PlatformGuide";

export const platformGuides = [
  {
    platform: "Facebook & Instagram",
    description: "Connect your Facebook and Instagram advertising accounts to manage campaigns and track performance.",
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
          "Under App Domains, add your authorized domain.",
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
        title: "Connect to Platform",
        instructions: [
          "Go to Connections > Facebook & Instagram.",
          "Click Connect Account.",
          "Authenticate with your Facebook account and grant the requested permissions.",
        ],
      },
    ],
  },
  {
    platform: "Google Ads",
    description: "Integrate your Google Ads accounts to sync campaign data and performance metrics.",
    steps: [
      {
        title: "Access Google Cloud Console",
        instructions: [
          "Go to the Google Cloud Console.",
          "Create a new project or select an existing one.",
          "Enable the Google Ads API for your project.",
        ],
      },
      {
        title: "Configure OAuth Consent",
        instructions: [
          "Set up the OAuth consent screen.",
          "Add necessary scopes for Google Ads access.",
          "Add your authorized domains and redirect URIs.",
        ],
      },
      {
        title: "Get API Credentials",
        instructions: [
          "Create OAuth 2.0 credentials (Client ID and Secret).",
          "Note down your Developer Token from Google Ads.",
          "Configure your redirect URI in the credentials.",
        ],
      },
      {
        title: "Connect to Platform",
        instructions: [
          "Go to Connections > Google Ads.",
          "Click Connect Account.",
          "Complete the Google authentication process.",
        ],
      },
    ],
  },
  {
    platform: "TikTok Ads",
    description: "Connect your TikTok Ads account to manage campaigns and track performance metrics.",
    steps: [
      {
        title: "Create TikTok Developer Account",
        instructions: [
          "Visit the TikTok for Developers portal.",
          "Create a developer account if you don't have one.",
          "Create a new app for advertising purposes.",
        ],
      },
      {
        title: "Configure App Settings",
        instructions: [
          "Set up your app's basic information.",
          "Add your redirect URI to the authorized URLs.",
          "Enable the Ads API functionality.",
        ],
      },
      {
        title: "Get API Credentials",
        instructions: [
          "Obtain your App ID and App Secret.",
          "Note down your Access Token if provided.",
          "Verify your redirect URI is correctly set.",
        ],
      },
      {
        title: "Connect to Platform",
        instructions: [
          "Go to Connections > TikTok Ads.",
          "Click Connect Account.",
          "Authorize the connection through TikTok.",
        ],
      },
    ],
  },
  {
    platform: "Snapchat Ads",
    description: "Integrate your Snapchat Ads account to manage campaigns and track performance.",
    steps: [
      {
        title: "Create Snap Developer Account",
        instructions: [
          "Visit the Snap Developer Portal.",
          "Create a new organization if needed.",
          "Create a new app for advertising.",
        ],
      },
      {
        title: "Configure Development Settings",
        instructions: [
          "Set up your app's basic information.",
          "Add your redirect URI to the allowed callbacks.",
          "Enable the Marketing API.",
        ],
      },
      {
        title: "Get API Credentials",
        instructions: [
          "Obtain your Client ID and Client Secret.",
          "Configure your OAuth redirect URI.",
          "Note down any additional API keys provided.",
        ],
      },
      {
        title: "Connect to Platform",
        instructions: [
          "Go to Connections > Snapchat Ads.",
          "Click Connect Account.",
          "Complete the Snapchat authentication flow.",
        ],
      },
    ],
  },
  {
    platform: "Pinterest Ads",
    description: "Connect your Pinterest Ads account to manage campaigns and track performance.",
    steps: [
      {
        title: "Create Pinterest Developer Account",
        instructions: [
          "Visit the Pinterest Developer Portal.",
          "Create a new app for advertising.",
          "Configure your app settings.",
        ],
      },
      {
        title: "Set Up API Access",
        instructions: [
          "Enable the Ads API for your app.",
          "Configure your redirect URIs.",
          "Set up the necessary scopes.",
        ],
      },
      {
        title: "Get API Credentials",
        instructions: [
          "Obtain your App ID and App Secret.",
          "Verify your redirect URI configuration.",
          "Note down any additional tokens provided.",
        ],
      },
      {
        title: "Connect to Platform",
        instructions: [
          "Go to Connections > Pinterest Ads.",
          "Click Connect Account.",
          "Authorize through Pinterest.",
        ],
      },
    ],
  },
  {
    platform: "DV360",
    description: "Connect your Display & Video 360 account to manage campaigns and track performance.",
    steps: [
      {
        title: "Set Up Google Cloud Project",
        instructions: [
          "Create or select a Google Cloud Project.",
          "Enable the DV360 API.",
          "Configure OAuth consent screen.",
        ],
      },
      {
        title: "Configure API Access",
        instructions: [
          "Create OAuth 2.0 credentials.",
          "Set up authorized redirect URIs.",
          "Note down Client ID and Secret.",
        ],
      },
      {
        title: "Get API Credentials",
        instructions: [
          "Obtain necessary API credentials.",
          "Configure API scopes for DV360.",
          "Set up authentication flow.",
        ],
      },
      {
        title: "Connect to Platform",
        instructions: [
          "Go to Connections > DV360.",
          "Click Connect Account.",
          "Complete Google authentication.",
        ],
      },
    ],
  },
];

export function PlatformGuideList() {
  return (
    <div className="grid gap-6">
      {platformGuides.map((guide) => (
        <PlatformGuide key={guide.platform} {...guide} />
      ))}
    </div>
  );
}