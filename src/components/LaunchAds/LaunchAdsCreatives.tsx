import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Upload } from "lucide-react";

export function LaunchAdsCreatives() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed rounded-lg p-8">
              <div className="bg-muted rounded-full p-4">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-medium">Upload Images</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your image files here or click to browse
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">Primary Text</Label>
            <Input id="headline" placeholder="Enter your ad's primary text" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Enter your ad's description" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta">Call to Action</Label>
            <Input id="cta" placeholder="E.g., Learn More, Shop Now" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Destination URL</Label>
            <Input id="url" placeholder="Enter your landing page URL" />
          </div>
        </div>
      </div>
    </div>
  );
}