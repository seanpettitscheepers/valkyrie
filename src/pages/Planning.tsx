import { PageLayout } from "@/components/Layout/PageLayout";
import { PlanningForm } from "@/components/Planning/PlanningForm";
import { PlansList } from "@/components/Planning/PlansList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Planning() {
  return (
    <PageLayout title="Battle Plans for Digital Domination">
      <div className="space-y-4 mb-6">
        <h1 className="text-2xl font-semibold">Battle Plans for Digital Domination</h1>
        <p className="text-muted-foreground">
          Set your campaign objectives, allocate budgets, and let Valkyrie craft a winning strategy tailored to your connected platforms and business goals.
        </p>
      </div>
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