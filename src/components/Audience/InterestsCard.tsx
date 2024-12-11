import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterestsCardProps {
  interests: {
    [key: string]: number;
  };
}

export function InterestsCard({ interests }: InterestsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-gradient-subtle border-border/5">
        <CardTitle className="flex items-center justify-between">
          User Interests
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(interests).map(([interest, value]) => (
            <div
              key={interest}
              className="relative overflow-hidden rounded-lg border bg-gradient-subtle p-4 transition-all hover:shadow-md"
            >
              <div className="relative z-10">
                <p className="capitalize font-medium mb-1">{interest}</p>
                <span className="text-sm text-muted-foreground">{value}% Engagement</span>
              </div>
              <div 
                className="absolute bottom-0 left-0 h-1 bg-gradient-brand transition-all"
                style={{ width: `${value}%` }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}