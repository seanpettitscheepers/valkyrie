import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Brain, Users, PieChart, Shield, Tag } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
      title: "Unified Campaign Dashboard",
      description: "View all your campaigns across platforms like Facebook, Instagram, TikTok, LinkedIn, and more in one place. Dive deep into performance metrics, filter insights, and track results."
    },
    {
      icon: <Brain className="h-8 w-8 text-secondary" />,
      title: "Smarter Campaign Planning",
      description: "Plan with precision. Use audience insights and past performance data to allocate budgets, select platforms, and define campaign objectives with AI-powered suggestions."
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Audience Insights & Recommendations",
      description: "Discover who's engaging with your ads. Leverage Valkyrie's insights to refine your targeting and let AI-powered recommendations suggest the most effective audiences."
    },
    {
      icon: <PieChart className="h-8 w-8 text-primary" />,
      title: "AI-Driven Budget Optimization",
      description: "Optimize your campaigns with our intelligent budget allocation tool. Let Valkyrie learn from your past campaigns to make smarter suggestions."
    },
    {
      icon: <Shield className="h-8 w-8 text-secondary" />,
      title: "Brand Sentiment & Risk Analysis",
      description: "Stay ahead of potential issues. Monitor mentions, analyze brand sentiment, and prevent risks before they escalate."
    },
    {
      icon: <Tag className="h-8 w-8 text-accent" />,
      title: "Campaign Naming Made Easy",
      description: "Keep campaigns organized with standardized naming taxonomies that push directly to your advertising platforms."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-brand bg-clip-text text-transparent">
          Streamline Your Advertising with Valkyrie
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          We're here to make digital advertising effortless for small businesses. With Valkyrie, you'll get:
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border/5 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="rounded-lg w-12 h-12 flex items-center justify-center bg-gradient-subtle mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}