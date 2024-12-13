import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LaunchAdsBudget() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Budget Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Budget</SelectItem>
                  <SelectItem value="lifetime">Lifetime Budget</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Budget Amount</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm">$</span>
                <Input type="number" placeholder="Enter amount" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bid Strategy</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select bid strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="target">Target Cost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" />
            </div>

            <div className="pt-4">
              <Button className="w-full">Review & Launch Campaign</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}