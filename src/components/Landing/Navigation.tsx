import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export function Navigation() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

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
          <a 
            href="#pricing-section" 
            className="text-foreground/60 hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Pricing
          </a>
          <a href="#about" className="text-foreground/60 hover:text-primary transition-colors">About</a>
        </div>
        <div className="flex items-center gap-2">
          {session ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-primary/10 hover:text-primary"
            >
              <Link to="/auth">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          )}
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