import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export function VerifyEmail() {
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Check your email</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <Mail className="mx-auto h-12 w-12 text-primary" />
        <p>
          We've sent you an email with a verification link. Please check your inbox
          and click the link to verify your account.
        </p>
        <p className="text-sm text-muted-foreground">
          If you don't see the email, check your spam folder or{" "}
          <a href="/auth" className="text-primary hover:underline">
            try signing up again
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}