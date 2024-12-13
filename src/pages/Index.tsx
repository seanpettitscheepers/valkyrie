import { PageLayout } from "@/components/Layout/PageLayout";
import { FacebookPagesManager } from "@/components/Integrations/Facebook/FacebookPagesManager";

export default function Index() {
  return (
    <PageLayout title="Dashboard">
      <div className="space-y-6">
        <FacebookPagesManager />
      </div>
    </PageLayout>
  );
}