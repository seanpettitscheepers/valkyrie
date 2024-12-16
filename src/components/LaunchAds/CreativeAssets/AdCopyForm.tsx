import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConnectedPlatforms } from "@/hooks/useConnectedPlatforms";

interface AdCopyFormProps {
  adCopy: {
    headline: string;
    description: string;
    cta: string;
    landingPageUrl: string;
  };
  onAdCopyChange: (field: string, value: string) => void;
}

export function AdCopyForm({ adCopy, onAdCopyChange }: AdCopyFormProps) {
  const { data: platforms, isLoading } = useConnectedPlatforms();
  
  // CTA options based on platforms
  const ctaOptions = new Set<string>();
  
  // Default CTAs available across most platforms
  const defaultCTAs = ["Learn More", "Sign Up", "Shop Now", "Contact Us", "Download"];
  defaultCTAs.forEach(cta => ctaOptions.add(cta));

  // Platform-specific CTAs
  if (platforms && Array.isArray(platforms)) {
    if (platforms.some(p => p.value === "facebook")) {
      ["Book Now", "Watch More", "Send Message", "Get Offer", "Get Showtimes"].forEach(cta => ctaOptions.add(cta));
    }

    if (platforms.some(p => p.value === "linkedin")) {
      ["Apply Now", "Register", "Request Demo", "Subscribe"].forEach(cta => ctaOptions.add(cta));
    }

    if (platforms.some(p => p.value === "google_ads")) {
      ["Get Quote", "Call Now", "View Plans", "Find Location"].forEach(cta => ctaOptions.add(cta));
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Headline/Title</Label>
        <Input
          placeholder="Enter attention-grabbing headline (30-90 characters)"
          maxLength={90}
          value={adCopy.headline}
          onChange={(e) => onAdCopyChange("headline", e.target.value)}
        />
        <p className="text-sm text-muted-foreground mt-1">
          {adCopy.headline.length}/90 characters
        </p>
      </div>

      <div>
        <Label>Description/Body Copy</Label>
        <Textarea
          placeholder="Enter main advertising message (90-500 characters)"
          maxLength={500}
          value={adCopy.description}
          onChange={(e) => onAdCopyChange("description", e.target.value)}
          className="min-h-[100px]"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {adCopy.description.length}/500 characters
        </p>
      </div>

      <div>
        <Label>Call to Action (CTA)</Label>
        <Select
          value={adCopy.cta}
          onValueChange={(value) => onAdCopyChange("cta", value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a call to action" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(ctaOptions).sort().map((cta) => (
              <SelectItem key={cta} value={cta}>
                {cta}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Landing Page URL</Label>
        <Input
          type="url"
          placeholder="https://example.com/landing-page"
          value={adCopy.landingPageUrl}
          onChange={(e) => onAdCopyChange("landingPageUrl", e.target.value)}
        />
      </div>
    </div>
  );
}