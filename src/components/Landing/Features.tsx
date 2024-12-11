import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Zap, Target, LineChart, Brain } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Campaign Management",
      description: "Efficiently manage and organize your advertising campaigns across multiple platforms."
    },
    {
      icon: <Users className="h-8 w-8 text-secondary" />,
      title: "Smart Naming",
      description: "Automated naming conventions ensure consistency and clarity across all your campaigns."
    },
    {
      icon: <LineChart className="h-8 w-8 text-accent" />,
      title: "Performance Analytics",
      description: "Comprehensive analytics and reporting to track campaign performance and ROI."
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Audience Insights",
      description: "Deep understanding of your audience demographics and behaviors."
    },
    {
      icon: <Brain className="h-8 w-8 text-secondary" />,
      title: "AI-Powered Insights",
      description: "Leverage artificial intelligence to optimize your campaigns and decision making."
    },
    {
      icon: <Zap className="h-8 w-8 text-accent" />,
      title: "Real-time Monitoring",
      description: "Stay on top of your campaigns with instant performance updates and alerts."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-brand bg-clip-text text-transparent">Key Features</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Everything you need to manage and optimize your advertising campaigns in one place
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