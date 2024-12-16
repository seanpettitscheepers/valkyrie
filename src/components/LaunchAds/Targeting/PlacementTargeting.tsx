import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PlacementTargeting() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Placements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Placement Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select placement type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatic Placements</SelectItem>
              <SelectItem value="manual">Manual Placements</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Device Types</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select devices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              <SelectItem value="mobile">Mobile Only</SelectItem>
              <SelectItem value="desktop">Desktop Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Platform Placements</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="facebook">Facebook Only</SelectItem>
              <SelectItem value="instagram">Instagram Only</SelectItem>
              <SelectItem value="audience">Audience Network</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}