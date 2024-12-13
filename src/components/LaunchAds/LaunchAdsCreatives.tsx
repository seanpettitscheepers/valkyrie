import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Upload, Plus } from "lucide-react";
import { useState } from "react";

export function LaunchAdsCreatives() {
  const [selectedFormat, setSelectedFormat] = useState("image");

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Ad Format</Label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select ad format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Single Image</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="collection">Collection</SelectItem>
                <SelectItem value="story">Story Ad</SelectItem>
                <SelectItem value="responsive">Responsive Display Ad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Primary Text</Label>
            <Textarea placeholder="Enter your ad's primary text" className="min-h-[100px]" />
          </div>

          <div className="space-y-2">
            <Label>Headline</Label>
            <Input placeholder="Enter your headline" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Enter your ad's description" />
          </div>

          <div className="space-y-2">
            <Label>Display URL</Label>
            <Input placeholder="Enter display URL" />
          </div>

          <div className="space-y-2">
            <Label>Call to Action</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a call to action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="learn_more">Learn More</SelectItem>
                <SelectItem value="shop_now">Shop Now</SelectItem>
                <SelectItem value="sign_up">Sign Up</SelectItem>
                <SelectItem value="download">Download</SelectItem>
                <SelectItem value="contact_us">Contact Us</SelectItem>
                <SelectItem value="book_now">Book Now</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed rounded-lg p-8">
              <div className="bg-muted rounded-full p-4">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-medium">Upload Media</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedFormat === "video" 
                    ? "Upload your video file (MP4, MOV)"
                    : "Upload your images (JPG, PNG)"}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>

            {selectedFormat === "carousel" && (
              <Button variant="outline" className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Image
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}