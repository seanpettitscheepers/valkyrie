import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlugOff } from "lucide-react";

interface UnconnectedStateProps {
  title: string;
  description: string;
  onConnect: () => void;
  isConnecting?: boolean;
}

export function UnconnectedState({ 
  title, 
  description, 
  onConnect, 
  isConnecting = false 
}: UnconnectedStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
        <PlugOff className="h-12 w-12 text-muted-foreground" />
        <Button
          onClick={onConnect}
          disabled={isConnecting}
          className="w-full max-w-xs"
        >
          {isConnecting ? "Connecting..." : "Connect Account"}
        </Button>
      </CardContent>
    </Card>
  );
}