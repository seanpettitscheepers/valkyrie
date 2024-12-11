import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Landing/Navigation";
import { Hero } from "@/components/Landing/Hero";
import { Features } from "@/components/Landing/Features";
import { PricingSection } from "@/components/Landing/PricingSection";

export default function Landing() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
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
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        session={session}
        isLoading={isSessionLoading}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <Hero />
      <Features />
      <PricingSection />
      
      {/* Auth Section */}
      <section id="auth-section" className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4 max-w-md">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-brand bg-clip-text text-transparent">
            Get Started
          </h2>
          <Card className="border-border/5 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardContent className="pt-6">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: 'hsl(var(--primary))',
                        brandAccent: 'hsl(var(--primary))',
                      },
                    },
                  },
                }}
                providers={[]}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/5">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AdConnective Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}