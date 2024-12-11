import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <h1 className="text-lg font-semibold bg-gradient-brand bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}