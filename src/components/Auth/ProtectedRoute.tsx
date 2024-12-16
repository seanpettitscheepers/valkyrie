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

  const { data: session, isLoading, error } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        // First clear any potentially invalid session data
        const currentSession = await supabase.auth.getSession();
        if (currentSession.error) {
          await supabase.auth.signOut();
          throw currentSession.error;
        }
        return currentSession.data.session;
      } catch (error) {
        console.error("Error fetching session:", error);
        throw error;
      }
    },
    retry: false // Don't retry on failure to prevent infinite loops
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

  if (error) {
    toast({
      title: "Authentication Error",
      description: "Please try signing in again",
      variant: "destructive",
    });
    navigate("/auth");
    return null;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}