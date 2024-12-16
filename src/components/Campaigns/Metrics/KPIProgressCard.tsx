import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface KPIProgressCardProps {
  title: string;
  completed: number;
  target: number;
}

export function KPIProgressCard({ title, completed, target }: KPIProgressCardProps) {
  const progress = Math.min((completed / target) * 100, 100);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize">
          {title}
        </CardTitle>
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{completed.toLocaleString()}</div>
        <Progress
          value={progress}
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Target: {target.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}