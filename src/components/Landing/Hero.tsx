import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <header className="container mx-auto px-4 py-24 text-center">
      <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-4 bg-muted/50">
        ✨ AI-Powered Campaign Management
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
        AdConnective Hub Unleashing the<br />Power of Analytics
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Streamline your advertising campaigns with intelligent insights, automated naming conventions, and comprehensive performance tracking.
      </p>
      <div className="flex gap-4 justify-center">
        <Button size="lg" onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}>
          Get Started
        </Button>
        <Button size="lg" variant="outline" onClick={() => document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" })}>
          View Pricing
        </Button>
      </div>
    </header>
  );
}