import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const planningFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  objective: z.enum(["awareness", "consideration", "conversion"]),
  total_budget: z.number().min(0),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  audience_insights_id: z.string().uuid().optional(),
  previous_campaign_id: z.string().uuid().optional(),
  notes: z.string().optional(),
});

type PlanningFormValues = z.infer<typeof planningFormSchema>;

export function PlanningForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PlanningFormValues>({
    resolver: zodResolver(planningFormSchema),
    defaultValues: {
      platforms: [],
      notes: "",
    },
  });

  // Fetch audience insights for dropdown
  const { data: audienceInsights, isLoading: loadingInsights } = useQuery({
    queryKey: ["audience-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audience_insights")
        .select("id, campaign_id, platform")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch previous campaigns for dropdown
  const { data: previousCampaigns, isLoading: loadingCampaigns } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, name")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
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

  if (loadingInsights || loadingCampaigns) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter plan name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Objective</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select objective" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="awareness">Awareness</SelectItem>
                        <SelectItem value="consideration">Consideration</SelectItem>
                        <SelectItem value="conversion">Conversion</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Budget</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter total budget"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platforms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platforms</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const currentPlatforms = field.value || [];
                        if (currentPlatforms.includes(value)) {
                          field.onChange(currentPlatforms.filter((p) => p !== value));
                        } else {
                          field.onChange([...currentPlatforms, value]);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platforms" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value?.map((platform) => (
                        <Button
                          key={platform}
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            field.onChange(field.value?.filter((p) => p !== platform));
                          }}
                        >
                          {platform} ×
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="audience_insights_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Use Audience Insights</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience insights" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {audienceInsights?.map((insight) => (
                          <SelectItem key={insight.id} value={insight.id}>
                            {insight.platform} - Campaign {insight.campaign_id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="previous_campaign_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Previous Campaign</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select previous campaign" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {previousCampaigns?.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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