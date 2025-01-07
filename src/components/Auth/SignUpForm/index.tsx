import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AuthFields } from "./AuthFields";
import { LegalConsentFields } from "./LegalConsentFields";
import { signUpSchema, type SignUpFormValues, type AuthError } from "./types";

interface SignUpFormProps {
  selectedPlan?: string | null;
  onComplete?: () => void;
}

export function SignUpForm({ selectedPlan = 'free', onComplete }: SignUpFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      password: "",
      phoneNumber: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error:", error);
    let errorMessage = "An error occurred during sign up. Please try again.";
    
    if (error.code === "invalid_credentials") {
      errorMessage = "Invalid email or password format. Please check your credentials.";
    } else if (error.code === "user_already_registered") {
      errorMessage = "This email is already registered. Please try signing in instead.";
    } else if (error.status === 400) {
      errorMessage = "Please check your email and password format.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    toast({
      title: "Sign Up Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email.toLowerCase(),
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            company_name: data.companyName,
            phone_number: data.phoneNumber,
            subscription_tier: selectedPlan,
          },
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Success",
        description: "Please check your email to verify your account",
      });

      if (onComplete) {
        onComplete();
      }

      navigate("/auth/verify");
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Create your account</h2>
        <p className="text-sm text-muted-foreground">
          {selectedPlan === 'free' 
            ? 'Get started with your free account'
            : `Start your ${selectedPlan} plan with a 14-day free trial`}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <PersonalInfoFields form={form} />
          <AuthFields form={form} />
          <LegalConsentFields form={form} />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}