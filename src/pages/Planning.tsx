import { PageLayout } from "@/components/Layout/PageLayout";
import { PlanningForm } from "@/components/Planning/PlanningForm";
import { PlansList } from "@/components/Planning/PlansList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Planning() {
  return (
    <PageLayout title="Campaign Planning">
      <Tabs defaultValue="new" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new">New Plan</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="new" className="space-y-6">
          <PlanningForm />
        </TabsContent>
        <TabsContent value="saved" className="space-y-6">
          <PlansList />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}