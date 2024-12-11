import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface NavigationProps {
  session: Session | null;
  isLoading: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function Navigation({ session, isLoading, onLogin, onLogout }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand" />
          <h1 className="text-xl font-bold bg-gradient-brand bg-clip-text text-transparent">
            Valkyrie
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="text-foreground/60 hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="text-foreground/60 hover:text-primary transition-colors">Pricing</a>
          <a href="#about" className="text-foreground/60 hover:text-primary transition-colors">About</a>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={session ? onLogout : onLogin}
          disabled={isLoading}
          className="hover:bg-primary/10 hover:text-primary"
        >
          {session ? (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </>
          )}
        </Button>
      </div>
    </nav>
  );
}