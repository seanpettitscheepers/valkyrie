import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface UTMParams {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

interface UTMGeneratorFormProps {
  onGenerate: (params: UTMParams) => void;
}

export function UTMGeneratorForm({ onGenerate }: UTMGeneratorFormProps) {
  const [formData, setFormData] = useState<UTMParams>({
    baseUrl: "",
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.baseUrl || !formData.source || !formData.medium || !formData.campaign) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      new URL(formData.baseUrl);
      onGenerate(formData);
    } catch (error) {
      toast.error("Please enter a valid URL");
    }
  };

  const handleInputChange = (field: keyof UTMParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="baseUrl">Base URL (required)</Label>
        <Input
          id="baseUrl"
          placeholder="https://example.com/page"
          value={formData.baseUrl}
          onChange={(e) => handleInputChange("baseUrl", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="source">Source (required)</Label>
        <Input
          id="source"
          placeholder="facebook, google, newsletter"
          value={formData.source}
          onChange={(e) => handleInputChange("source", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="medium">Medium (required)</Label>
        <Input
          id="medium"
          placeholder="cpc, email, social"
          value={formData.medium}
          onChange={(e) => handleInputChange("medium", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="campaign">Campaign Name (required)</Label>
        <Input
          id="campaign"
          placeholder="summer_sale_2024"
          value={formData.campaign}
          onChange={(e) => handleInputChange("campaign", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="term">Term (optional)</Label>
        <Input
          id="term"
          placeholder="running+shoes"
          value={formData.term}
          onChange={(e) => handleInputChange("term", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="content">Content (optional)</Label>
        <Input
          id="content"
          placeholder="logolink or textlink"
          value={formData.content}
          onChange={(e) => handleInputChange("content", e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        Generate UTM URL
      </Button>
    </form>
  );
}