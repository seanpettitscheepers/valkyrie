import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { KPITargetDialog } from "./KPITargetDialog";

interface KPIProgressCardProps {
  title: string;
  completed: number;
  target: number;
}

export function KPIProgressCard({ title, completed, target }: KPIProgressCardProps) {
  const progress = (completed / target) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="capitalize">{title}</CardTitle>
        <KPITargetDialog metricName={title} currentTarget={target} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} />
          <div className="flex justify-between text-sm">
            <span>Completed: {completed.toLocaleString()}</span>
            <span>Target: {target.toLocaleString()}</span>
          </div>
          <div className="text-lg font-semibold">
            {Math.round(progress)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}