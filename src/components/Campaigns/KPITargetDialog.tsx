import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings2 } from "lucide-react";

interface KPITargetDialogProps {
  metricName: string;
  currentTarget?: number;
}

export function KPITargetDialog({ metricName, currentTarget }: KPITargetDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateKPIMutation = useMutation({
    mutationFn: async (target: number) => {
      const { data, error } = await supabase
        .from("custom_kpis")
        .upsert(
          {
            metric_name: metricName,
            target_value: target,
            current_value: null, // This will be updated through the metrics data
          },
          { onConflict: "metric_name" }
        );

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-kpis"] });
      setOpen(false);
      toast({
        title: "KPI Target Updated",
        description: `Target for ${metricName} has been updated successfully.`,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const target = Number(formData.get("target"));
    updateKPIMutation.mutate(target);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set KPI Target for {metricName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target">Target Value</Label>
            <Input
              id="target"
              name="target"
              type="number"
              defaultValue={currentTarget}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Save Target
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}