import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { planningFormSchema, PlanningFormValues } from "./types";
import { BasicInfoFields } from "./BasicInfoFields";
import { PlatformsField } from "./PlatformsField";
import { ReferenceFields } from "./ReferenceFields";
import { TargetingObjectivesField } from "./TargetingObjectivesField";

export function PlanningForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PlanningFormValues>({
    resolver: zodResolver(planningFormSchema),
    defaultValues: {
      platforms: [],
      notes: "",
      targeting_objectives: [],
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
            audienceInsightsId: values.audience_insights_id,
            previousCampaignId: values.previous_campaign_id,
            targetingObjectives: values.targeting_objectives,
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
              <BasicInfoFields form={form} />
              <PlatformsField form={form} />
              <TargetingObjectivesField form={form} />
              <ReferenceFields form={form} />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes or requirements"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={createPlan.isPending}>
          {createPlan.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create Plan
        </Button>
      </form>
    </Form>
  );
}