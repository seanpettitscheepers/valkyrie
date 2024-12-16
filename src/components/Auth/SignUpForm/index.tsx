import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AuthFields } from "./AuthFields";
import { LegalConsentFields } from "./LegalConsentFields";
import { signUpSchema, type SignUpFormValues } from "./types";

// Get the reCAPTCHA site key from environment variables
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

interface SignUpFormProps {
  selectedPlan?: string | null;
  onComplete?: () => void;
}

export function SignUpForm({ selectedPlan = 'free', onComplete }: SignUpFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

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

  const onSubmit = async (data: SignUpFormValues) => {
    if (!captchaToken) {
      toast({
        title: "Error",
        description: "Please complete the reCAPTCHA verification",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If RECAPTCHA_SITE_KEY is not available, show an error message
  if (!RECAPTCHA_SITE_KEY) {
    console.error('ReCAPTCHA site key is not configured');
    return (
      <div className="text-center text-red-500">
        Error: ReCAPTCHA is not properly configured. Please contact support.
      </div>
    );
  }

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

          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !captchaToken}
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