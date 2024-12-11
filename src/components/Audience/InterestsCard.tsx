import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InterestsCardProps {
  interests: {
    categories?: string[];
    topics?: string[];
  };
}

export function InterestsCard({ interests }: InterestsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interests & Topics</CardTitle>
      </CardHeader>
      <CardContent>
        {interests.categories && (
          <div>
            <h4 className="font-medium mb-2">Interest Categories</h4>
            <div className="flex flex-wrap gap-2">
              {interests.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
        {interests.topics && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Topics</h4>
            <div className="flex flex-wrap gap-2">
              {interests.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-secondary/10 rounded-full text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}