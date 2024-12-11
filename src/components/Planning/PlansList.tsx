import { useQuery } from "@tanstack/react-query";
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
import { Card } from "@/components/ui/card";
import { Eye, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PlansList() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["campaign-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaign_plans")
        .select(`
          *,
          audience_insights (
            platform,
            demographics
          ),
          campaigns (
            name
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Objective</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans?.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell className="capitalize">{plan.objective}</TableCell>
              <TableCell>${plan.total_budget.toLocaleString()}</TableCell>
              <TableCell className="capitalize">{plan.status}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>

<DialogContent className="max-w-2xl">
  <DialogHeader>
    <DialogTitle>{plan.name}</DialogTitle>
  </DialogHeader>
  <div className="space-y-4">
    <div>
      <h4 className="font-medium mb-2">Budget Allocation</h4>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(plan.budget_allocation).map(([platform, amount]) => (
          <div key={platform} className="flex justify-between">
            <span className="capitalize">{platform}</span>
            <span>${(amount as number).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
    {plan.targeting_objectives && plan.targeting_objectives.length > 0 && (
      <div>
        <h4 className="font-medium mb-2">Targeting Objectives</h4>
        <div className="space-y-2">
          {plan.targeting_objectives.map((objective, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
              <div>
                <span className="capitalize font-medium">{objective.type}</span>
                <p className="text-sm text-muted-foreground">{objective.description}</p>
              </div>
              <span className="text-sm capitalize px-2 py-1 rounded bg-background">
                {objective.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
    {plan.audience_insights && (
      <div>
        <h4 className="font-medium mb-2">Audience Insights</h4>
        <p>Platform: {plan.audience_insights.platform}</p>
      </div>
    )}
    {plan.campaigns && (
      <div>
        <h4 className="font-medium mb-2">Reference Campaign</h4>
        <p>{plan.campaigns.name}</p>
      </div>
    )}
    {plan.notes && (
      <div>
        <h4 className="font-medium mb-2">Notes</h4>
        <p>{plan.notes}</p>
      </div>
    )}
  </div>
</DialogContent>

                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
