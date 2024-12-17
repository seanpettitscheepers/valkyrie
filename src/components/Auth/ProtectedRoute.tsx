import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        // First try to get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          await supabase.auth.signOut();
          throw error;
        }

        if (!session) {
          throw new Error("No session found");
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("User verification error:", userError);
          await supabase.auth.signOut();
          throw new Error("Invalid session");
        }

        return session;
      } catch (error) {
        console.error("Auth error:", error);
        // Clear any invalid session data
        await supabase.auth.signOut();
        throw error;
      }
    },
    retry: false, // Don't retry on failure
    staleTime: 1000 * 60 * 5, // Consider the session fresh for 5 minutes
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (!isLoading) {
      setIsCheckingSession(false);
      if (!session) {
        toast({
          title: "Session expired",
          description: "Please sign in to continue",
          variant: "destructive",
        });
        navigate("/auth");
      }
    }
  }, [session, isLoading, navigate, toast]);

  if (isLoading || isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}