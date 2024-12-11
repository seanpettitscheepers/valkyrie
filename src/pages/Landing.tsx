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
import { MessageSquare, Star } from "lucide-react";

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

  const testimonials = [
    {
      quote: "Valkyrie transformed how we manage our ad campaigns. It's like having a digital agency in my back pocket!",
      author: "Sarah M.",
      role: "Small Business Owner"
    },
    {
      quote: "The planning tool is a game-changer. I now know exactly where to focus my ad spend.",
      author: "James T.",
      role: "E-commerce Store Founder"
    },
    {
      quote: "As a small business, we couldn't afford a full agency. Valkyrie is affordable, and the insights are incredible!",
      author: "Maria R.",
      role: "Startup CEO"
    }
  ];

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
      
      {/* About Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-brand bg-clip-text text-transparent">
            Meet Valkyrie: Your Digital Guardian
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground mb-6">
              At Valkyrie, we believe in empowering small businesses to thrive in the digital world.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              We know that managing advertising campaigns across multiple platforms can feel overwhelming, and hiring an agency isn't always an option. That's why we created Valkyrie — an intelligent, user-friendly platform that gives you the power of a full-scale digital agency without the hefty price tag.
            </p>
            <p className="text-lg text-muted-foreground">
              Whether you're just starting or scaling your business, Valkyrie is here to guide your campaigns to success.
            </p>
          </div>
        </div>
      </section>

      <PricingSection />
      
      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-brand bg-clip-text text-transparent">
            What Our Customers Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background/60 backdrop-blur animate-fade-in">
                <CardContent className="pt-6">
                  <MessageSquare className="h-8 w-8 text-primary mb-4" />
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-secondary fill-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Auth Section */}
      <section id="auth-section" className="py-24">
        <div className="container mx-auto px-4 max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-brand bg-clip-text text-transparent">
            Are You Ready to Take Your Digital Advertising to the Next Level?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join hundreds of small businesses using Valkyrie to unify, optimize, and grow.
          </p>
          <Card className="border-border/5 bg-background/60 backdrop-blur">
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
          <p>&copy; {new Date().getFullYear()} Valkyrie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}