import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { planningFormSchema, PlanningFormValues } from "./types";
import { ObjectiveSelection } from "./ObjectiveSelection";
import { BudgetInput } from "./BudgetInput";
import { PlatformsField } from "./PlatformsField";
import { TargetingObjectivesField } from "./TargetingObjectivesField";
import { ReferenceFields } from "./ReferenceFields";

export function PlanningForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PlanningFormValues>({
    resolver: zodResolver(planningFormSchema),
    defaultValues: {
      platforms: [],
      notes: "",
      targeting_objectives: [],
      budget_caps: [],
      geographical_targeting: [],
      ad_formats: [],
    },
  });

  const createPlan = useMutation({
    mutationFn: async (values: PlanningFormValues) => {
      // Call the AI recommendations edge function for budget allocation
      const { data: recommendationData, error: recommendationError } = await supabase.functions.invoke(
        "generate-budget-recommendations",
        {
          body: {
            objective: values.objective,
            platforms: values.platforms,
            totalBudget: values.total_budget,
            budgetCaps: values.budget_caps,
            audienceInsightsId: values.audience_insights_id,
            previousCampaignId: values.previous_campaign_id,
            targetingObjectives: values.targeting_objectives,
            geographicalTargeting: values.geographical_targeting,
            adFormats: values.ad_formats,
          },
        }
      );

      if (recommendationError) throw recommendationError;

      // Insert the plan with AI-recommended budget allocation
      const { data, error } = await supabase.from("campaign_plans").insert({
        name: values.name,
        objective: values.objective,
        total_budget: values.total_budget,
        platforms: values.platforms,
        budget_allocation: recommendationData.budgetAllocation,
        audience_insights_id: values.audience_insights_id,
        previous_campaign_id: values.previous_campaign_id,
        notes: values.notes,
        targeting_objectives: values.targeting_objectives,
        geographical_targeting: values.geographical_targeting,
        ad_formats: values.ad_formats,
        budget_caps: values.budget_caps,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign-plans"] });
      toast({
        title: "Success",
        description: "Campaign plan has been created successfully.",
      });
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating plan:", error);
      toast({
        title: "Error",
        description: "Failed to create campaign plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: PlanningFormValues) => {
    createPlan.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <ObjectiveSelection form={form} />
              <BudgetInput form={form} />
              <PlatformsField form={form} />
              <TargetingObjectivesField form={form} />
              <ReferenceFields form={form} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={createPlan.isPending}>
          {createPlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Plan
        </Button>
      </form>
    </Form>
  );
}