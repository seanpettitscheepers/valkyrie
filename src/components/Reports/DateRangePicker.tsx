import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function DateRangePicker() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Button variant="ghost" size="sm" className="text-primary">Today</Button>
      <Button variant="ghost" size="sm">Yesterday</Button>
      <Button variant="secondary" size="sm">7 D</Button>
      <Button variant="ghost" size="sm">30 D</Button>
      <Button variant="ghost" size="sm">3 M</Button>
      <Button variant="ghost" size="sm">6 M</Button>
      <Button variant="ghost" size="sm">12 M</Button>
      <Button variant="ghost" size="sm">Custom</Button>
      <Button variant="ghost" size="icon" className="ml-2">
        <Calendar className="h-4 w-4" />
      </Button>
    </div>
  );
}