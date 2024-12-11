import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check, LogIn, LogOut } from "lucide-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useToast } from "@/components/ui/use-toast";

export default function Landing() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: plans, isLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price");

      if (error) throw error;
      return data;
    },
  });

  // Check if user is already logged in
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
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">AdConnective Hub</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={session ? handleLogout : handleLogin}
            disabled={isSessionLoading}
          >
            {session ? (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </>
            )}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-primary mb-6">
          AdConnective Hub
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

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Efficiently manage and organize your advertising campaigns across multiple platforms.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Smart Naming</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Automated naming conventions ensure consistency and clarity across all your campaigns.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive analytics and reporting to track campaign performance and ROI.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {plans?.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      ${plan.price}/month
                      {plan.annual_price && (
                        <span className="block text-sm">
                          or ${plan.annual_price}/year
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(plan.features as string[]).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6" onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}>
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth-section" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-md">
          <h2 className="text-3xl font-bold text-center mb-8">Get Started</h2>
          <Card>
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
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AdConnective Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}