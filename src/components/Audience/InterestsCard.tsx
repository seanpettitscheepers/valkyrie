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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Interests</CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(interests).map(([interest, value]) => (
            <Button
              key={interest}
              variant="outline"
              className="justify-between h-auto py-3"
            >
              <span className="capitalize text-sm">{interest}</span>
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                {value}%
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}