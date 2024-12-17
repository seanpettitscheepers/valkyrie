import { PageLayout } from "@/components/Layout/PageLayout";
import { OptimizationDashboard } from "@/components/Optimization/OptimizationDashboard";

export default function Index() {
  return (
    <PageLayout title="Dashboard">
      <OptimizationDashboard />
    </PageLayout>
  );
}