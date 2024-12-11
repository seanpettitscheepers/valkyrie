import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Zap } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Campaign Management",
      description: "Efficiently manage and organize your advertising campaigns across multiple platforms."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Smart Naming",
      description: "Automated naming conventions ensure consistency and clarity across all your campaigns."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Performance Analytics",
      description: "Comprehensive analytics and reporting to track campaign performance and ROI."
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardHeader>
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
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