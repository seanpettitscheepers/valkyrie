import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PlanningFormValues } from "./types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReferenceFieldsProps {
  form: UseFormReturn<PlanningFormValues>;
}

export function ReferenceFields({ form }: ReferenceFieldsProps) {
  const { data: audienceInsights } = useQuery({
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

  const { data: previousCampaigns } = useQuery({
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

  return (
    <div className="space-y-6">
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
    </div>
  );
}