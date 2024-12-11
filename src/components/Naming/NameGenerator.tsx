import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GeneratorForm } from "./GeneratorForm";
import { GeneratorResults } from "./GeneratorResults";
import { GeneratedNames } from "./types";

export function NameGenerator() {
  const [generatedNames, setGeneratedNames] = useState<GeneratedNames>({
    campaign: "",
    adset: "",
    ad: "",
    utm: "",
  });

  const { data: components, isLoading } = useQuery({
    queryKey: ["name-components"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaign_name_components")
        .select("*");
      
      if (error) throw error;
      
      return data.map(component => ({
        ...component,
        options: component.options as string[]
      }));
    },
  });

  const handleGenerate = async (names: GeneratedNames) => {
    // Save to database
    const { error } = await supabase
      .from("generated_names")
      .insert({
        strategy_name: names.campaign.split("_").pop() || "",
        advertiser: names.campaign.split("_")[0],
        channel: names.campaign.split("_")[1],
        objective: names.campaign.split("_")[2],
        placement: names.adset.split("_")[3],
        campaign_name: names.campaign,
        adset_name: names.adset,
        ad_name: names.ad,
        utm_tag: names.utm,
      });

    if (error) {
      toast.error("Failed to save generated names");
      return;
    }

    setGeneratedNames(names);
    toast.success("Names generated successfully");
  };

  if (isLoading) {
    return <div>Loading components...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Name Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <GeneratorForm 
          components={components} 
          onGenerate={handleGenerate}
        />
        <GeneratorResults names={generatedNames} />
      </CardContent>
    </Card>
  );
}