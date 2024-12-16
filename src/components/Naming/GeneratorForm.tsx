import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NameComponent, FormData, PlatformGeneratedNames } from "./types";
import { PlatformSelector } from "./PlatformSelector";
import { useConnectedPlatforms } from "@/hooks/useConnectedPlatforms";

interface GeneratorFormProps {
  components: NameComponent[] | undefined;
  onGenerate: (names: PlatformGeneratedNames) => void;
}

export function GeneratorForm({ components, onGenerate }: GeneratorFormProps) {
  const [formData, setFormData] = useState<FormData>({
    strategyName: "",
    brand: "",
    platforms: [],
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

  const { data: connectedPlatforms } = useConnectedPlatforms();

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformAdd = (platform: string) => {
    if (!formData.platforms.includes(platform)) {
      handleInputChange('platforms', [...formData.platforms, platform]);
    }
  };

  const handlePlatformRemove = (platform: string) => {
    handleInputChange('platforms', formData.platforms.filter(p => p !== platform));
  };

  const generateNames = async () => {
    if (!formData.strategyName || !formData.brand || formData.platforms.length === 0 || 
        !formData.objective || !formData.placement) {
      toast.error("Please fill in all fields and select at least one platform");
      return;
    }

    const generatedNames: PlatformGeneratedNames = {};
    
    formData.platforms.forEach(platform => {
      const campaignName = `${formData.brand}_${platform}_${formData.objective}`;
      const adsetName = `${campaignName}_${formData.placement}`;
      const adName = `${adsetName}_${formData.strategyName}`;
      const utmTag = `utm_source=${platform.toLowerCase()}&utm_medium=${formData.placement.toLowerCase()}&utm_campaign=${formData.strategyName.toLowerCase()}`;

      generatedNames[platform] = {
        campaign: campaignName,
        adset: adsetName,
        ad: adName,
        utm: utmTag,
      };
    });

    onGenerate(generatedNames);
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

      <PlatformSelector
        platforms={connectedPlatforms || []}
        selectedPlatforms={formData.platforms}
        onPlatformAdd={handlePlatformAdd}
        onPlatformRemove={handlePlatformRemove}
      />

      {components?.filter(component => !["advertiser", "channel"].includes(component.type)).map((component) => (
        <div key={component.id}>
          <label className="text-sm font-medium">{component.name}</label>
          <Select
            value={formData[component.type as keyof Omit<FormData, "strategyName" | "brand" | "platforms">]}
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