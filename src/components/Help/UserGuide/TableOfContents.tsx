import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export function TableOfContents() {
  const sections = [
    { title: "Getting Started", href: "#getting-started" },
    { title: "Connecting Your Platforms", href: "#connecting-platforms" },
    { title: "Using the Dashboard", href: "#using-dashboard" },
    { title: "Planning Campaigns", href: "#planning-campaigns" },
    { title: "Campaign Management", href: "#campaign-management" },
    { title: "Audience Insights", href: "#audience-insights" },
    { title: "Optimization with AI", href: "#optimization" },
    { title: "Brand Sentiment and Risk Analysis", href: "#brand-sentiment" },
    { title: "Account Settings", href: "#account-settings" },
    { title: "Help and Support", href: "#help-support" },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
        <nav className="space-y-2">
          {sections.map((section, index) => (
            <div key={section.href}>
              <Link
                to={section.href}
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {index + 1}. {section.title}
              </Link>
            </div>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}