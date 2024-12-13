import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Unplug } from "lucide-react";

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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center py-6 space-y-4">
        <Unplug className="h-12 w-12 text-muted-foreground" />
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