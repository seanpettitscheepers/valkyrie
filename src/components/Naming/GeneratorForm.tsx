import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NameComponent, FormData, GeneratedNames } from "./types";

interface GeneratorFormProps {
  components: NameComponent[] | undefined;
  onGenerate: (names: GeneratedNames) => void;
}

export function GeneratorForm({ components, onGenerate }: GeneratorFormProps) {
  const [formData, setFormData] = useState<FormData>({
    strategyName: "",
    brand: "",  // Changed from advertiser to brand
    channel: "",
    objective: "",
    placement: "",
  });

  // Fetch user's brands
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateNames = async () => {
    // Basic validation
    if (!formData.strategyName || !formData.brand || !formData.channel || 
        !formData.objective || !formData.placement) {
      toast.error("Please fill in all fields");
      return;
    }

    const campaignName = `${formData.brand}_${formData.channel}_${formData.objective}`;
    const adsetName = `${campaignName}_${formData.placement}`;
    const adName = `${adsetName}_${formData.strategyName}`;
    const utmTag = `utm_source=${formData.channel.toLowerCase()}&utm_medium=${formData.placement.toLowerCase()}&utm_campaign=${formData.strategyName.toLowerCase()}`;

    onGenerate({
      campaign: campaignName,
      adset: adsetName,
      ad: adName,
      utm: utmTag,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Strategy Name</label>
        <Input
          placeholder="Enter strategy name"
          value={formData.strategyName}
          onChange={(e) => handleInputChange("strategyName", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Brand</label>
        <Select
          value={formData.brand}
          onValueChange={(value) => handleInputChange("brand", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent>
            {brands?.map((brand) => (
              <SelectItem key={brand.id} value={brand.name}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {components?.filter(component => component.type !== "advertiser").map((component) => (
        <div key={component.id}>
          <label className="text-sm font-medium">{component.name}</label>
          <Select
            value={formData[component.type as keyof Omit<FormData, "strategyName" | "brand">]}
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
  );
}