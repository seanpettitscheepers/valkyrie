import { Navigation } from "@/components/Landing/Navigation";
import { Hero } from "@/components/Landing/Hero";
import { MainContent } from "@/components/Landing/MainContent";
import { PricingSection } from "@/components/Landing/PricingSection";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <MainContent />
      <PricingSection />
      <footer className="py-8 border-t border-border/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} Valkyrie. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Use
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}