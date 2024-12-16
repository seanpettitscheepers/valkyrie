import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SignUpForm } from "@/components/Auth/SignUpForm";
import { VerifyEmail } from "@/components/Auth/VerifyEmail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "sign_in";

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
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <VerifyEmail />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">Welcome to Valkyrie</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account or create a new one
          </p>
        </div>
        
        <Tabs defaultValue={mode} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign_in">Sign In</TabsTrigger>
            <TabsTrigger value="sign_up">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sign_in">
            <div className="bg-card p-6 rounded-lg shadow-lg border">
              <SupabaseAuth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#FF5D8F',
                        brandAccent: '#FF8F5D',
                      },
                    },
                  },
                }}
                providers={[]}
                view="sign_in"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="sign_up">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}