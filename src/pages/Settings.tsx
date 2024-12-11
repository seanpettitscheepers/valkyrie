import { PageLayout } from "@/components/Layout/PageLayout";
import { PlatformIntegrations } from "@/components/Settings/PlatformIntegrations";
import { BenchmarksSection } from "@/components/Settings/Benchmarks/BenchmarksSection";
import { ReportBuilder } from "@/components/Reports/ReportBuilder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <PageLayout title="Settings">
      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Platform Integrations</TabsTrigger>
          <TabsTrigger value="reports">Report Builder</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <PlatformIntegrations />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Report Builder</h2>
              <p className="text-muted-foreground">
                Create custom reports by selecting campaigns, date ranges, and metrics
              </p>
            </div>
          </div>
          <ReportBuilder />
        </TabsContent>

        <TabsContent value="benchmarks">
          <BenchmarksSection />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Settings;