import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function PricingSection() {
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

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const handleSubscribe = async (priceId: string | null) => {
    try {
      if (!priceId) {
        toast({
          title: "Error",
          description: "Invalid price ID. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      if (!session) {
        document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const planTitles = {
    free: "Free Tier",
    starter: "Starter Plan",
    growth: "Growth Plan",
    enterprise: "Enterprise Plan"
  };

  const planDescriptions = {
    free: "Perfect for testing the waters",
    starter: "For businesses starting to scale",
    growth: "For businesses scaling up",
    enterprise: "For growing businesses and agencies"
  };

  const planCTAs = {
    free: "Start Your Free Trial",
    starter: "Get Started Now",
    growth: "Level Up Your Advertising",
    enterprise: "Request a Demo"
  };

  return (
    <section id="pricing-section" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-brand bg-clip-text text-transparent">
          Simple Plans for Every Business
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Choose the plan that best fits your needs. All plans include a 14-day free trial of premium features.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans?.map((plan) => (
            <Card key={plan.id} className="relative overflow-hidden animate-fade-in">
              {plan.tier === 'growth' && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{planTitles[plan.tier as keyof typeof planTitles]}</CardTitle>
                <CardDescription>
                  {plan.price === 0 ? (
                    "Free"
                  ) : (
                    <>
                      ${plan.price}/month
                      {plan.annual_price && (
                        <span className="block text-sm">
                          or ${plan.annual_price}/year
                        </span>
                      )}
                    </>
                  )}
                </CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  {planDescriptions[plan.tier as keyof typeof planDescriptions]}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {(plan.features as string[]).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.tier === 'growth' ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.price_id)}
                >
                  {planCTAs[plan.tier as keyof typeof planCTAs]}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}