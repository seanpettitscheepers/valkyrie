import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { signUpSchema } from "./SignUpForm/types";
import type { SignUpFormValues } from "./SignUpForm/types";

const RECAPTCHA_SITE_KEY = "6LfHxGApAAAAADkxZHRGXfyZKAQjnCPXjOXN5Qxe";

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
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      Terms and Conditions
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privacyAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

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