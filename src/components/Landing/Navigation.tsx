import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/1a46432a-b7c0-4cb5-b92b-46b8bcb5b920.png" 
            alt="Valkyrie" 
            className="h-8"
          />
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="text-foreground/60 hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="text-foreground/60 hover:text-primary transition-colors">Pricing</a>
          <a href="#about" className="text-foreground/60 hover:text-primary transition-colors">About</a>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Link to="/campaigns">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}