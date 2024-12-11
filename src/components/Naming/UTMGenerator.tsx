import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UTMGeneratorForm } from "./UTMGeneratorForm";
import { UTMGeneratorResults } from "./UTMGeneratorResults";

interface UTMParams {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export function UTMGenerator() {
  const [generatedUrl, setGeneratedUrl] = useState<string>("");

  const handleGenerate = (params: UTMParams) => {
    const url = new URL(params.baseUrl);
    url.searchParams.set("utm_source", params.source);
    url.searchParams.set("utm_medium", params.medium);
    url.searchParams.set("utm_campaign", params.campaign);
    
    if (params.term) {
      url.searchParams.set("utm_term", params.term);
    }
    if (params.content) {
      url.searchParams.set("utm_content", params.content);
    }

    setGeneratedUrl(url.toString());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>UTM URL Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <UTMGeneratorForm onGenerate={handleGenerate} />
        <UTMGeneratorResults url={generatedUrl} />
      </CardContent>
    </Card>
  );
}