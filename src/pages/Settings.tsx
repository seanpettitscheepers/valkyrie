import { PageLayout } from "@/components/Layout/PageLayout";
import { PlatformIntegrations } from "@/components/Settings/PlatformIntegrations";
import { BenchmarksSection } from "@/components/Settings/Benchmarks/BenchmarksSection";

const Settings = () => {
  return (
    <PageLayout title="Settings">
      <div className="space-y-10">
        <PlatformIntegrations />
        <BenchmarksSection />
      </div>
    </PageLayout>
  );
};

export default Settings;