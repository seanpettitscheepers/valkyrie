import { PageLayout } from "@/components/Layout/PageLayout";
import { OptimizationDashboard } from "@/components/Optimization/OptimizationDashboard";

const Optimization = () => {
  return (
    <PageLayout title="Campaign Optimization">
      <OptimizationDashboard />
    </PageLayout>
  );
};

export default Optimization;