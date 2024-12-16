import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SignUpForm } from "@/components/Auth/SignUpForm";
import { VerifyEmail } from "@/components/Auth/VerifyEmail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "sign_in";

  const { data: plans } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .neq('tier', 'freyja')
        .order("price");
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (mode === "verify") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
        <VerifyEmail />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-lg space-y-8 mb-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/1a46432a-b7c0-4cb5-b92b-46b8bcb5b920.png" 
            alt="Valkyrie" 
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-primary">Welcome to Valkyrie</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account or create a new one
          </p>
        </div>
        
        <Card className="border-border/5 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardContent className="pt-6">
            <Tabs defaultValue={mode} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="sign_in">Sign In</TabsTrigger>
                <TabsTrigger value="sign_up">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sign_in">
                <SupabaseAuth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#496946',
                          brandAccent: '#858071',
                          inputBackground: 'transparent',
                          inputBorder: 'hsl(var(--border))',
                        },
                      },
                    },
                    className: {
                      button: 'bg-primary hover:bg-primary/90',
                      input: 'bg-background',
                      label: 'text-foreground',
                    },
                  }}
                  providers={[]}
                  view="sign_in"
                />
              </TabsContent>
              
              <TabsContent value="sign_up">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}