import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface NameComponent {
  id: string;
  name: string;
  type: string;
  options: string[];
}

interface FormData {
  strategyName: string;
  advertiser: string;
  channel: string;
  objective: string;
  placement: string;
}

export function NameGenerator() {
  const [formData, setFormData] = useState<FormData>({
    strategyName: "",
    advertiser: "",
    channel: "",
    objective: "",
    placement: "",
  });

  const [generatedNames, setGeneratedNames] = useState({
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateNames = async () => {
    // Basic validation
    if (!formData.strategyName || !formData.advertiser || !formData.channel || 
        !formData.objective || !formData.placement) {
      toast.error("Please fill in all fields");
      return;
    }

    const campaignName = `${formData.advertiser}_${formData.channel}_${formData.objective}`;
    const adsetName = `${campaignName}_${formData.placement}`;
    const adName = `${adsetName}_${formData.strategyName}`;
    const utmTag = `utm_source=${formData.channel.toLowerCase()}&utm_medium=${formData.placement.toLowerCase()}&utm_campaign=${formData.strategyName.toLowerCase()}`;

    // Save to database
    const { error } = await supabase
      .from("generated_names")
      .insert({
        strategy_name: formData.strategyName,
        advertiser: formData.advertiser,
        channel: formData.channel,
        objective: formData.objective,
        placement: formData.placement,
        campaign_name: campaignName,
        adset_name: adsetName,
        ad_name: adName,
        utm_tag: utmTag,
      });

    if (error) {
      toast.error("Failed to save generated names");
      return;
    }

    setGeneratedNames({
      campaign: campaignName,
      adset: adsetName,
      ad: adName,
      utm: utmTag,
    });

    toast.success("Names generated successfully");
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
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
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Strategy Name</label>
            <Input
              placeholder="Enter strategy name"
              value={formData.strategyName}
              onChange={(e) => handleInputChange("strategyName", e.target.value)}
            />
          </div>

          {components?.map((component) => (
            <div key={component.id}>
              <label className="text-sm font-medium">{component.name}</label>
              <Select
                value={formData[component.type as keyof Omit<FormData, "strategyName">]}
                onValueChange={(value) => handleInputChange(component.type as keyof FormData, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${component.name.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {component.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <Button onClick={generateNames} className="w-full">
            Generate Names
          </Button>
        </div>

        {generatedNames.campaign && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium">Campaign Name</label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={generatedNames.campaign} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(generatedNames.campaign, "Campaign name")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Ad Set Name</label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={generatedNames.adset} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(generatedNames.adset, "Ad set name")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Ad Name</label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={generatedNames.ad} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(generatedNames.ad, "Ad name")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">UTM Tag</label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={generatedNames.utm} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(generatedNames.utm, "UTM tag")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  </div>