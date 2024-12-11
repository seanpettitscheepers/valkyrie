import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <header className="container mx-auto px-4 py-24 text-center">
      <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-4 bg-muted/50 animate-fade-in">
        <Rocket className="h-4 w-4 mr-2 text-primary" />
        AI-Powered Campaign Management
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-brand bg-clip-text text-transparent mb-4 animate-fade-in [animation-delay:200ms]">
        Take Control of Your Digital Advertising with Valkyrie
      </h1>
      <p className="text-2xl font-semibold mb-2 animate-fade-in [animation-delay:300ms]">
        Unify. Optimize. Grow.
      </p>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in [animation-delay:400ms]">
        Say goodbye to scattered campaigns and data overload. Valkyrie is your all-in-one platform for managing, planning, and optimizing digital advertising across all major platforms.
      </p>
      <div className="flex gap-4 justify-center animate-fade-in [animation-delay:600ms]">
        <Button 
          size="lg" 
          className="bg-gradient-brand hover:opacity-90 transition-opacity group"
          onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          Start Your Free Trial Today
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          className="border-primary hover:bg-primary/10"
          onClick={() => document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          View Pricing
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-4 animate-fade-in [animation-delay:800ms]">
        No credit card required. Cancel anytime.
      </p>
    </header>
  );
}