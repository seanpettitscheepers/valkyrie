import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationTargeting } from "./Targeting/LocationTargeting";
import { DemographicsTargeting } from "./Targeting/DemographicsTargeting";
import { DetailedTargeting } from "./Targeting/DetailedTargeting";
import { CustomAudiences } from "./Targeting/CustomAudiences";
import { PlacementTargeting } from "./Targeting/PlacementTargeting";

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
            <LocationTargeting />
            <DemographicsTargeting />
          </div>
        </TabsContent>

        <TabsContent value="interests" className="space-y-4 mt-4">
          <DetailedTargeting />
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 mt-4">
          <CustomAudiences />
        </TabsContent>

        <TabsContent value="placement" className="space-y-4 mt-4">
          <PlacementTargeting />
        </TabsContent>
      </Tabs>
    </div>
  );
}