import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterestsCardProps {
  interests: {
    [key: string]: number;
  };
}

export function InterestsCard({ interests }: InterestsCardProps) {
  // Split interests into topics and categories
  const topics = Object.entries(interests).filter(([key]) => 
    ['mobile', 'desktop', 'tablet', 'social media', 'email'].includes(key.toLowerCase())
  );
  
  const categories = Object.entries(interests).filter(([key]) => 
    !['mobile', 'desktop', 'tablet', 'social media', 'email'].includes(key.toLowerCase())
  );

  const renderSection = (title: string, items: [string, number][]) => (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map(([interest, value]) => (
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
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Interests</CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {topics.length > 0 && renderSection("Topics", topics)}
        {categories.length > 0 && renderSection("Categories", categories)}
      </CardContent>
    </Card>
  );
}