import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LocationTargeting() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Target Locations</Label>
          <Textarea placeholder="Enter locations (one per line)" className="min-h-[100px]" />
        </div>
        <div className="space-y-2">
          <Label>Location Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select location type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="living_in">People living in</SelectItem>
              <SelectItem value="recently_in">People recently in</SelectItem>
              <SelectItem value="traveling_in">People traveling in</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}