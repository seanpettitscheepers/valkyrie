import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { SavedCampaignSelector } from "./SavedCampaignSelector";
import { FileUpload } from "./CreativeAssets/FileUpload";
import { AdCopyForm } from "./CreativeAssets/AdCopyForm";
import { CampaignNames } from "./CreativeAssets/CampaignNames";

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

  const handleNamesChange = (field: string, value: string) => {
    setNames(prev => ({ ...prev, [field]: value }));
  };

  const handleAdCopyChange = (field: string, value: string) => {
    setAdCopy(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <SavedCampaignSelector onSelect={handleImport} />

      <Card>
        <CardHeader>
          <CardTitle>Campaign Names</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignNames 
            names={names} 
            onNamesChange={handleNamesChange} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Creative Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload 
            files={files} 
            onFileChange={handleFileChange} 
          />

          <AdCopyForm 
            adCopy={adCopy} 
            onAdCopyChange={handleAdCopyChange} 
          />
        </CardContent>
      </Card>
    </div>
  );
}