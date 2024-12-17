import { PageLayout } from "@/components/Layout/PageLayout";
import { OptimizationDashboard } from "@/components/Optimization/OptimizationDashboard";

export default function Optimization() {
  return (
    <PageLayout title="Campaign Optimization">
      <div className="space-y-4 mb-6">
        <h1 className="text-2xl font-semibold">AI-Powered Campaign Optimization</h1>
        <p className="text-muted-foreground">
          Get actionable insights and optimization recommendations for your campaigns across all platforms.
        </p>
      </div>
      <OptimizationDashboard />
    </PageLayout>
  );
}