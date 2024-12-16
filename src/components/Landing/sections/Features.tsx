import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Brain, Target, Shield, Users, AlertCircle, ArrowRight } from "lucide-react";

export function Features() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-brand bg-clip-text text-transparent">
          Built to Protect, Serve, and Empower
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          Valkyrie offers an arsenal of features designed to simplify your digital marketing efforts and maximize results.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Layers,
              title: "Unified Dashboard",
              description: "See all your campaign performance across Facebook, Instagram, TikTok, LinkedIn, Google Ads, Amazon DSP, and more—all in one place."
            },
            {
              icon: Brain,
              title: "AI-Powered Optimization",
              description: "Get ChatGPT-powered recommendations for budget allocation, audience targeting, and campaign adjustments."
            },
            {
              icon: Target,
              title: "Planning Made Easy",
              description: "Use past audience insights and campaign data to plan new campaigns. Enter your budget, select platforms, and let Valkyrie suggest the best strategy."
            },
            {
              icon: Shield,
              title: "Custom Naming Taxonomies",
              description: "Standardize your campaign naming conventions effortlessly to maintain clarity and consistency across platforms."
            },
            {
              icon: Users,
              title: "Audience Insights",
              description: "Gain detailed reports on who's responding to your ads and use this knowledge to refine your future campaigns."
            },
            {
              icon: AlertCircle,
              title: "Risk Mitigation",
              description: "Analyze brand sentiment, track volume of mentions, and proactively identify potential brand risks in the digital ecosystem."
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-background/60 backdrop-blur animate-fade-in">
              <CardContent className="pt-6">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            variant="outline"
            className="border-primary hover:bg-primary/10"
          >
            See All Features
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}