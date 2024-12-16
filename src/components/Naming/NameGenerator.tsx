import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GeneratorForm } from "./GeneratorForm";
import { GeneratorResults } from "./GeneratorResults";
import { PlatformGeneratedNames } from "./types";

export function NameGenerator() {
  const [generatedNames, setGeneratedNames] = useState<PlatformGeneratedNames>({});

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

  const handleGenerate = async (names: PlatformGeneratedNames) => {
    // Save to database - now handling multiple platforms
    const savePromises = Object.entries(names).map(([platform, platformNames]) => {
      return supabase
        .from("generated_names")
        .insert({
          strategy_name: platformNames.campaign.split("_").pop() || "",
          advertiser: platformNames.campaign.split("_")[0],
          channel: platform,
          objective: platformNames.campaign.split("_")[2],
          placement: platformNames.adset.split("_")[3],
          campaign_name: platformNames.campaign,
          adset_name: platformNames.adset,
          ad_name: platformNames.ad,
          utm_tag: platformNames.utm,
        });
    });

    try {
      await Promise.all(savePromises);
      setGeneratedNames(names);
      toast.success("Names generated successfully");
    } catch (error) {
      toast.error("Failed to save generated names");
    }
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