import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LaunchAdsBudget() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="budget" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="bidding">Bidding</TabsTrigger>
        </TabsList>

        <TabsContent value="budget" className="space-y-4 mt-4">
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
                    <SelectItem value="campaign">Campaign Budget</SelectItem>
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
                <Label>Spend Strategy</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select spend strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Delivery</SelectItem>
                    <SelectItem value="accelerated">Accelerated Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Schedule</CardTitle>
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

              <div className="space-y-2">
                <Label>Ad Scheduling</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_times">Run ads all the time</SelectItem>
                    <SelectItem value="specific">Run ads on specific schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="et">Eastern Time</SelectItem>
                    <SelectItem value="ct">Central Time</SelectItem>
                    <SelectItem value="mt">Mountain Time</SelectItem>
                    <SelectItem value="pt">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bidding" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bidding Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Optimization Goal</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select optimization goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="clicks">Link Clicks</SelectItem>
                    <SelectItem value="impressions">Impressions</SelectItem>
                    <SelectItem value="reach">Daily Unique Reach</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bid Strategy</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bid strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lowest_cost">Lowest Cost</SelectItem>
                    <SelectItem value="target_cost">Target Cost</SelectItem>
                    <SelectItem value="highest_value">Highest Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cost Control</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <Input type="number" placeholder="Enter bid cap or target cost" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button size="lg">
          Review & Launch Campaign
        </Button>
      </div>
    </div>
  );
}