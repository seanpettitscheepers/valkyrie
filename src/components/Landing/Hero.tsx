import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <header className="container mx-auto px-4 py-24 text-center">
      <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-4 bg-muted/50 animate-fade-in">
        <Shield className="h-4 w-4 mr-2 text-primary" />
        Your Digital Advertising Guardian
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-brand bg-clip-text text-transparent mb-4 animate-fade-in [animation-delay:200ms]">
        Protect, Serve, and Conquer the Marketing Battlefield
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in [animation-delay:400ms]">
        Valkyrie is the ultimate adverting app for small businesses, empowering you to master the digital advertising landscape with precision, efficiency, and insight. From campaign planning to optimization, we're here to safeguard your investment and lead your brand to victory.
      </p>
      <div className="flex gap-4 justify-center animate-fade-in [animation-delay:600ms]">
        <Button 
          size="lg" 
          className="bg-gradient-brand hover:opacity-90 transition-opacity group"
          onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          Get Started for Free
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          className="border-primary hover:bg-primary/10"
        >
          <Play className="mr-2 h-4 w-4" />
          Watch Demo
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-4 animate-fade-in [animation-delay:800ms]">
        No credit card required. Cancel anytime.
      </p>
    </header>
  );
}