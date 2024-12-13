import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LaunchAdsTargeting() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="demographics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="interests">Interests & Behaviors</TabsTrigger>
          <TabsTrigger value="custom">Custom Audiences</TabsTrigger>
          <TabsTrigger value="placement">Placements</TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="space-y-4 mt-4">
          <div className="grid gap-6 md:grid-cols-2">
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

            <Card>
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Age Range</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Min age" className="w-24" />
                    <span>to</span>
                    <Input type="number" placeholder="Max age" className="w-24" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interests" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Targeting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Interests</Label>
                <Textarea 
                  placeholder="Enter interests (e.g., Technology, Fashion, Sports)" 
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Behaviors</Label>
                <Textarea 
                  placeholder="Enter behaviors (e.g., Online shoppers, Frequent travelers)" 
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Demographics</Label>
                <Textarea 
                  placeholder="Enter demographic traits (e.g., New parents, College students)" 
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 mt-4">
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
        </TabsContent>

        <TabsContent value="placement" className="space-y-4 mt-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}