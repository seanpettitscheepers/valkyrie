import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function FlowAnalysis() {
  const flowData = {
    steps: [
      { id: "A", name: "visit_website", value: "100%", drop: null },
      { id: "B", name: "fill_form", value: "84.5%", drop: "15.5%" },
      { id: "B+1", name: "sign_in", value: "75%", drop: "25.5%" },
      { id: "C", name: "view_product", value: "58.5%", drop: "10.5%" },
      { id: "C+1", name: "buy_product", value: "28%", drop: "25.5%" },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="relative h-[400px] bg-gradient-to-r from-primary/5 to-background rounded-lg p-4">
        <div className="absolute inset-0 flex items-center justify-between p-8">
          {flowData.steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium">{step.id}</span>
                <span className="text-xs text-muted-foreground">{step.name}</span>
              </div>
              <div className="h-32 w-16 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium">{step.value}</span>
              </div>
              {step.drop && (
                <div className="text-xs text-destructive">
                  Drop {step.drop}
                </div>
              )}
              {index < flowData.steps.length - 1 && (
                <Button variant="ghost" size="icon" className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}