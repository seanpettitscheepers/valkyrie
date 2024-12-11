import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterestsCardProps {
  interests: {
    [key: string]: number;
  };
}

export function InterestsCard({ interests }: InterestsCardProps) {
  const maxValue = Math.max(...Object.values(interests));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Interests</CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(interests).map(([interest, value]) => (
            <div key={interest} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize text-muted-foreground">{interest}</span>
                <span className="font-medium">{value}%</span>
              </div>
              <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}