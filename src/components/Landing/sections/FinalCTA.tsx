import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-brand bg-clip-text text-transparent">
          Are You Ready to Conquer the Digital Marketing Battlefield?
        </h2>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-gradient-brand hover:opacity-90 transition-opacity group"
            onClick={() => document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Start for Free
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-primary hover:bg-primary/10"
          >
            Book a Demo
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-8">
          Have questions? Contact us at support@valkyriehub.com
        </p>
      </div>
    </section>
  );
}