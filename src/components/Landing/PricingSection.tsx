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

  const handleSubscribe = async (priceId: string | null) => {
    try {
      if (!priceId && priceId !== null) {
        toast({
          title: "Error",
          description: "Invalid price ID. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      // For enterprise plan, redirect to contact
      if (priceId === null) {
        window.location.href = "/contact";
        return;
      }

      // For free plan, redirect to auth section
      if (priceId === "free") {
        document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      // For paid plans, redirect to auth section
      document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" });
      
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

  return (
    <section id="pricing-section" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-brand bg-clip-text text-transparent">
          Choose Your Battle Plan
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Select the plan that best fits your mission. All paid plans include a 14-day free trial.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans?.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden animate-fade-in ${
                plan.tier === 'growth' ? 'border-primary' : ''
              }`}
            >
              {plan.tier === 'growth' && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                </CardTitle>
                <CardDescription className="space-y-2">
                  {plan.price === null ? (
                    <span className="text-2xl font-bold">Custom</span>
                  ) : plan.price === 0 ? (
                    <span className="text-2xl font-bold">Free</span>
                  ) : (
                    <div>
                      <span className="text-2xl font-bold">${plan.price}</span>
                      <span className="text-sm">/month</span>
                      {plan.annual_price && (
                        <div className="text-sm text-muted-foreground">
                          or ${plan.annual_price}/year
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-sm mt-2">{plan.description}</p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ul className="space-y-2 mb-6">
                    {(plan.features as string[]).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.tier === 'growth' ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.price_id)}
                  >
                    {plan.price === null 
                      ? "Contact Sales" 
                      : plan.price === 0 
                        ? "Get Started Free" 
                        : "Start Free Trial"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}