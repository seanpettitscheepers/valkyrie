import { PlatformGuide } from "./PlatformGuide";

export function PlatformGuideList() {
  const guides = [
    {
      platform: "Facebook Ads Manager Integration",
      description: "Connect your Facebook Ads Manager account to Valkyrie for seamless campaign setup, optimization, and performance monitoring.",
      steps: [
        {
          title: "Log in to Valkyrie",
          instructions: ["Open www.valkyriehub.com and navigate to the Integrations section."]
        },
        {
          title: "Select Facebook Ads Manager",
          instructions: ["From the list of platforms, click on Facebook Ads Manager."]
        },
        {
          title: "Authenticate",
          instructions: [
            "Log in using your Facebook credentials.",
            "Grant Valkyrie access to your Business Manager account."
          ]
        },
        {
          title: "Select Ad Accounts",
          instructions: ["Choose the ad accounts you want to connect to Valkyrie."]
        },
        {
          title: "Sync Campaign Data",
          instructions: ["Valkyrie will begin importing your active campaigns, ad sets, and ads into your dashboard."]
        }
      ]
    },
    {
      platform: "Facebook Pages Integration",
      description: "Sync your Facebook Pages with Valkyrie to access organic engagement data and audience insights.",
      steps: [
        {
          title: "Go to Integrations",
          instructions: ["In Valkyrie, select Facebook Pages from the platform list."]
        },
        {
          title: "Log in to Facebook",
          instructions: ["Use your credentials to authenticate."]
        },
        {
          title: "Select Pages",
          instructions: ["Choose which pages you’d like to connect."]
        },
        {
          title: "Grant Permissions",
          instructions: [
            "Allow Valkyrie to access page insights and post performance."
          ]
        },
        {
          title: "Sync Data",
          instructions: ["Once connected, Valkyrie will start importing audience engagement metrics."]
        }
      ]
    },
    {
      platform: "Google Ads Integration",
      description: "Manage and optimize your Google Ads campaigns directly from Valkyrie.",
      steps: [
        {
          title: "Choose Google Ads in Integrations",
          instructions: ["Log into Valkyrie and select Google Ads from the integrations menu."]
        },
        {
          title: "Sign in with Google",
          instructions: ["Enter your Google Ads account credentials."]
        },
        {
          title: "Grant Permissions",
          instructions: [
            "Allow Valkyrie to read campaign data.",
            "Manage ads and keywords."
          ]
        },
        {
          title: "Sync Campaigns",
          instructions: ["Select the campaigns to import into Valkyrie."]
        }
      ]
    },
    {
      platform: "DV360 Integration",
      description: "Integrate Google Display & Video 360 (DV360) to manage advanced programmatic campaigns in Valkyrie.",
      steps: [
        {
          title: "Navigate to Integrations",
          instructions: ["Select DV360 from the list of platforms."]
        },
        {
          title: "Log in",
          instructions: ["Use your Google credentials tied to your DV360 account."]
        },
        {
          title: "Authorize Valkyrie",
          instructions: [
            "Grant access to campaign, insertion order, and line item data."
          ]
        },
        {
          title: "Select Advertisers",
          instructions: ["Import the specific advertisers you’d like to track in Valkyrie."]
        }
      ]
    },
    {
      platform: "TikTok Ads Integration",
      description: "Connect your TikTok Ads account to Valkyrie for creative ad management and short-form video performance insights.",
      steps: [
        {
          title: "Select TikTok Ads in Valkyrie",
          instructions: ["Open the integrations section and choose TikTok Ads."]
        },
        {
          title: "Log in with TikTok for Business",
          instructions: ["Use your credentials to authenticate."]
        },
        {
          title: "Grant Permissions",
          instructions: ["Provide Valkyrie access to your ad accounts and campaign data."]
        },
        {
          title: "Sync Campaigns",
          instructions: ["Valkyrie will begin importing data from active campaigns."]
        }
      ]
    },
    {
      platform: "Pinterest Ads Integration",
      description: "Sync your Pinterest Ads account to Valkyrie for insights into pin performance and audience engagement.",
      steps: [
        {
          title: "Choose Pinterest Ads in Integrations",
          instructions: ["Select Pinterest Ads from the Valkyrie integrations menu."]
        },
        {
          title: "Authenticate",
          instructions: ["Log in using your Pinterest Business account credentials."]
        },
        {
          title: "Allow Access",
          instructions: ["Grant Valkyrie permission to read campaign data and audience insights."]
        },
        {
          title: "Sync Data",
          instructions: ["Valkyrie will import your Pinterest Ads data into the dashboard."]
        }
      ]
    },
    {
      platform: "Snapchat Ads Integration",
      description: "Integrate your Snapchat Ads account to manage your vertical video campaigns through Valkyrie.",
      steps: [
        {
          title: "Navigate to Integrations",
          instructions: ["Select Snapchat Ads in the Valkyrie menu."]
        },
        {
          title: "Log in",
          instructions: ["Enter your Snapchat Ads Manager credentials."]
        },
        {
          title: "Grant Permissions",
          instructions: [
            "Allow Valkyrie to access ad accounts, campaigns, and ad set data."
          ]
        },
        {
          title: "Sync Campaigns",
          instructions: ["Import your Snapchat Ads campaigns."]
        }
      ]
    },
    {
      platform: "Amazon DSP Integration",
      description: "Connect Amazon DSP to Valkyrie for access to programmatic ad data and audience targeting insights.",
      steps: [
        {
          title: "Select Amazon DSP in Integrations",
          instructions: ["Go to Valkyrie’s integrations menu and choose Amazon DSP."]
        },
        {
          title: "Authenticate",
          instructions: ["Log in with your Amazon Advertising credentials."]
        },
        {
          title: "Allow Permissions",
          instructions: [
            "Enable Valkyrie to access campaigns and ad performance data.",
            "Manage audience segments."
          ]
        },
        {
          title: "Sync Campaigns",
          instructions: ["Valkyrie will pull in your Amazon DSP campaign data."]
        }
      ]
    },
    {
      platform: "The Trade Desk Integration",
      description: "Integrate your Trade Desk account to track advanced programmatic advertising campaigns via Valkyrie.",
      steps: [
        {
          title: "Choose The Trade Desk in Integrations",
          instructions: ["Open Valkyrie and select The Trade Desk."]
        },
        {
          title: "Log in with Trade Desk Credentials",
          instructions: ["Use your account details to authenticate."]
        },
        {
          title: "Grant Permissions",
          instructions: [
            "Allow Valkyrie to access campaign data, audience segments, and performance metrics."
          ]
        },
        {
          title: "Sync Campaigns",
          instructions: ["Import your Trade Desk campaigns into Valkyrie."]
        }
      ]
    },
    {
      platform: "Twitter (X) Ads Integration",
      description: "Sync Twitter Ads (X) to Valkyrie for campaign tracking and audience engagement insights.",
      steps: [
        {
          title: "Navigate to Integrations",
          instructions: ["In Valkyrie, select Twitter Ads (X)."]
        },
        {
          title: "Authenticate",
          instructions: ["Log in with your Twitter Ads account credentials."]
        },
        {
          title: "Grant Permissions",
          instructions: [
            "Enable Valkyrie to read campaign and audience data."
          ]
        },
        {
          title: "Sync Campaigns",
          instructions: ["Import your Twitter Ads data into the Valkyrie dashboard."]
        }
      ]
    },
    {
      platform: "Google Analytics Integration",
      description: "Connect Google Analytics to Valkyrie for holistic performance insights, including website traffic and ad-driven conversions.",
      steps: [
        {
          title: "Choose Google Analytics in Integrations",
          instructions: ["Select Google Analytics from Valkyrie’s integrations list."]
        },
        {
          title: "Sign in with Google",
          instructions: ["Use the account linked to your Analytics property."]
        },
        {
          title: "Grant Permissions",
          instructions: [
            "Allow Valkyrie to access property and view data."
          ]
        },
        {
          title: "Sync Data",
          instructions: ["Valkyrie will integrate Analytics data with your advertising performance metrics."]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {guides.map((guide, index) => (
        <PlatformGuide
          key={index}
          platform={guide.platform}
          description={guide.description}
          steps={guide.steps}
        />
      ))}
    </div>
  );
}
