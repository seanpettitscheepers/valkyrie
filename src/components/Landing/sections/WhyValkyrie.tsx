import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Layers, Brain, ChartBar, ArrowRight } from "lucide-react";

export function WhyValkyrie() {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-brand bg-clip-text text-transparent">
          Your Protector in the Digital Marketing Arena
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-8">
          The digital marketing landscape can feel like a chaotic battlefield. With so many platforms, metrics, and strategies to juggle, how can you ensure your advertising budget is safe and your campaigns are effective?
        </p>
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          That's where Valkyrie steps in. We're not just another SaaS platform—we're your trusted partner, your guardian, your secret weapon. Valkyrie unites your digital advertising accounts into one powerful hub, offering unparalleled insights, effortless campaign management, and cutting-edge optimization powered by AI.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            {
              icon: Shield,
              title: "Protect Your Investment",
              description: "Minimize waste with data-driven strategies and actionable insights across platforms."
            },
            {
              icon: Layers,
              title: "Simplify Your Campaigns",
              description: "Manage all your advertising channels from one unified dashboard."
            },
            {
              icon: Brain,
              title: "Maximize ROI",
              description: "Plan, execute, and optimize campaigns with AI-driven recommendations tailored to your goals."
            },
            {
              icon: ChartBar,
              title: "Conquer with Confidence",
              description: "Make decisions backed by real-time analytics, audience insights, and industry benchmarks."
            }
          ].map((benefit, index) => (
            <Card key={index} className="bg-background/60 backdrop-blur animate-fade-in">
              <CardContent className="pt-6">
                <benefit.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-gradient-brand hover:opacity-90 transition-opacity group"
            onClick={() => document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Try Valkyrie Free
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}