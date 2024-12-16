import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NameComponent, FormData, PlatformGeneratedNames } from "./types";

interface GeneratorFormProps {
  components: NameComponent[] | undefined;
  onGenerate: (names: PlatformGeneratedNames) => void;
}

export function GeneratorForm({ components, onGenerate }: GeneratorFormProps) {
  const [formData, setFormData] = useState<FormData>({
    strategyName: "",
    brand: "",
    platforms: [], // Now an array
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

  // Fetch connected platforms
  const { data: connectedPlatforms } = useQuery({
    queryKey: ["connected-platforms"],
    queryFn: async () => {
      const [
        { data: facebook },
        { data: dv360 },
        { data: tiktok },
        { data: pinterest },
        { data: snapchat },
        { data: googleAds },
        { data: linkedin }
      ] = await Promise.all([
        supabase.from("facebook_ad_accounts").select("id").limit(1),
        supabase.from("dv360_accounts").select("id").limit(1),
        supabase.from("tiktok_ad_accounts").select("id").limit(1),
        supabase.from("pinterest_ad_accounts").select("id").limit(1),
        supabase.from("snapchat_ad_accounts").select("id").limit(1),
        supabase.from("google_ads_accounts").select("id").limit(1),
        supabase.from("linkedin_ad_accounts").select("id").limit(1)
      ]);

      const platforms = [];
      if (facebook?.length) platforms.push({ value: "facebook", label: "Facebook" });
      if (dv360?.length) platforms.push({ value: "dv360", label: "Display & Video 360" });
      if (tiktok?.length) platforms.push({ value: "tiktok", label: "TikTok" });
      if (pinterest?.length) platforms.push({ value: "pinterest", label: "Pinterest" });
      if (snapchat?.length) platforms.push({ value: "snapchat", label: "Snapchat" });
      if (googleAds?.length) platforms.push({ value: "google_ads", label: "Google Ads" });
      if (linkedin?.length) platforms.push({ value: "linkedin", label: "LinkedIn" });

      return platforms;
    },
  });

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
    // Basic validation
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

      <div>
        <label className="text-sm font-medium">Platforms</label>
        <Select
          value=""
          onValueChange={handlePlatformAdd}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select platforms" />
          </SelectTrigger>
          <SelectContent>
            {connectedPlatforms?.map((platform) => (
              <SelectItem 
                key={platform.value} 
                value={platform.value}
                disabled={formData.platforms.includes(platform.value)}
              >
                {platform.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.platforms.map(platform => {
            const platformLabel = connectedPlatforms?.find(p => p.value === platform)?.label || platform;
            return (
              <Badge 
                key={platform} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {platformLabel}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handlePlatformRemove(platform)}
                />
              </Badge>
            );
          })}
        </div>
      </div>

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