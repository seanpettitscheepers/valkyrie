import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BehaviorAnalysisProps {
  data: any[];
}

export function BehaviorAnalysis({ data }: BehaviorAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Behavior Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Add behavior analysis content here */}
            <p className="text-muted-foreground">Behavior analysis data will be displayed here</p>
          </div>
        ) : (
          <p className="text-muted-foreground">No behavior data available</p>
        )}
      </CardContent>
    </Card>
  );
}