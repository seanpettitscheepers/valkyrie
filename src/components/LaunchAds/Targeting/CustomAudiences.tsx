import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CustomAudiences() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Audiences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Website Custom Audiences</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visitors_30d">Last 30 days visitors</SelectItem>
              <SelectItem value="visitors_90d">Last 90 days visitors</SelectItem>
              <SelectItem value="purchasers">Recent purchasers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Customer List</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select customer list" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_customers">All customers</SelectItem>
              <SelectItem value="newsletter">Newsletter subscribers</SelectItem>
              <SelectItem value="high_value">High-value customers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Lookalike Audiences</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select lookalike source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customers">Similar to customers</SelectItem>
              <SelectItem value="website">Similar to website visitors</SelectItem>
              <SelectItem value="engaged">Similar to engaged users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}