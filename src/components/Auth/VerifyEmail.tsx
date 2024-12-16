import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export function VerifyEmail() {
  return (
    <Card className="w-full max-w-md border-border/5 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription>
          We've sent you a verification link. Please check your email to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        <p>Didn't receive the email? Check your spam folder or contact support.</p>
      </CardContent>
    </Card>
  );
}