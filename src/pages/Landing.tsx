import { Navigation } from "@/components/Landing/Navigation";
import { Hero } from "@/components/Landing/Hero";
import { MainContent } from "@/components/Landing/MainContent";
import { PricingSection } from "@/components/Landing/PricingSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <MainContent />
      <PricingSection />
      <footer className="py-8 border-t border-border/5">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Valkyrie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}