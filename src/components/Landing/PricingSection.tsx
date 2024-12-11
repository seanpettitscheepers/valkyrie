import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

export function PricingSection() {
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <section id="pricing-section" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans?.map((plan) => (
            <Card key={plan.id} className="relative overflow-hidden">
              {plan.tier === 'growth' && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm">
                  Popular
                </div>
              )}
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
                <ul className="space-y-2 mb-6">
                  {(plan.features as string[]).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.tier === 'growth' ? 'default' : 'outline'}
                  onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}