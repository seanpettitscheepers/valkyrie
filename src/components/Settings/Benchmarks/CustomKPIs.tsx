import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const CustomKPIs = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: kpis, isLoading } = useQuery({
    queryKey: ["custom-kpis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_kpis")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createKPIMutation = useMutation({
    mutationFn: async (formData: {
      metric_name: string;
      target_value: number;
      unit: string;
      description: string;
    }) => {
      const { error } = await supabase.from("custom_kpis").insert([formData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-kpis"] });
      setOpen(false);
      toast({
        title: "KPI Created",
        description: "Your custom KPI has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create custom KPI.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createKPIMutation.mutate({
      metric_name: formData.get("metric_name") as string,
      target_value: Number(formData.get("target_value")),
      unit: formData.get("unit") as string,
      description: formData.get("description") as string,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Custom KPIs</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Custom KPI
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom KPI</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metric_name">Metric Name</Label>
                <Input
                  id="metric_name"
                  name="metric_name"
                  placeholder="Enter metric name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_value">Target Value</Label>
                <Input
                  id="target_value"
                  name="target_value"
                  type="number"
                  step="0.01"
                  placeholder="Enter target value"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  placeholder="Enter unit (e.g., %, USD)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Enter description"
                />
              </div>
              <Button type="submit" className="w-full">
                Create KPI
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead>Target Value</TableHead>
            <TableHead>Current Value</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            kpis?.map((kpi) => (
              <TableRow key={kpi.id}>
                <TableCell className="font-medium">
                  {kpi.metric_name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </TableCell>
                <TableCell>{kpi.target_value}</TableCell>
                <TableCell>{kpi.current_value || "Not set"}</TableCell>
                <TableCell>{kpi.unit}</TableCell>
                <TableCell>{kpi.description}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};