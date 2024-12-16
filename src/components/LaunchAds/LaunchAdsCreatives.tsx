import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SavedCampaignSelector } from "./SavedCampaignSelector";
import { useState } from "react";
import { ImagePlus, Upload } from "lucide-react";

export function LaunchAdsCreatives() {
  const [names, setNames] = useState({
    campaignName: "",
    adSetName: "",
    adName: "",
  });

  const [adCopy, setAdCopy] = useState({
    headline: "",
    description: "",
    cta: "",
    landingPageUrl: "",
  });

  const [files, setFiles] = useState<FileList | null>(null);

  const handleImport = (importedNames: {
    campaignName: string;
    adSetName: string;
    adName: string;
  }) => {
    setNames(importedNames);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-6">
      <SavedCampaignSelector onSelect={handleImport} />

      <Card>
        <CardHeader>
          <CardTitle>Campaign Names</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Campaign Name</Label>
            <Input
              placeholder="Enter campaign name"
              value={names.campaignName}
              onChange={(e) =>
                setNames((prev) => ({ ...prev, campaignName: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Ad Set Name</Label>
            <Input
              placeholder="Enter ad set name"
              value={names.adSetName}
              onChange={(e) =>
                setNames((prev) => ({ ...prev, adSetName: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Ad Name</Label>
            <Input
              placeholder="Enter ad name"
              value={names.adName}
              onChange={(e) =>
                setNames((prev) => ({ ...prev, adName: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Creative Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Upload Images or Videos</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
              <div className="flex justify-center">
                <ImagePlus className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <Label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80"
                >
                  <span>Upload files</span>
                  <Input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  or drag and drop your files here
                </p>
              </div>
              {files && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    {files.length} file(s) selected
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Headline/Title</Label>
              <Input
                placeholder="Enter attention-grabbing headline (30-90 characters)"
                maxLength={90}
                value={adCopy.headline}
                onChange={(e) =>
                  setAdCopy((prev) => ({ ...prev, headline: e.target.value }))
                }
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
                onChange={(e) =>
                  setAdCopy((prev) => ({ ...prev, description: e.target.value }))
                }
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {adCopy.description.length}/500 characters
              </p>
            </div>

            <div>
              <Label>Call to Action (CTA)</Label>
              <Input
                placeholder="e.g., Shop Now, Learn More, Sign Up"
                value={adCopy.cta}
                onChange={(e) =>
                  setAdCopy((prev) => ({ ...prev, cta: e.target.value }))
                }
              />
            </div>

            <div>
              <Label>Landing Page URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/landing-page"
                value={adCopy.landingPageUrl}
                onChange={(e) =>
                  setAdCopy((prev) => ({ ...prev, landingPageUrl: e.target.value }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}