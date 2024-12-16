import { PageLayout } from "@/components/Layout/PageLayout";
import { PageHeader } from "@/components/ui/page-header";

export default function Reports() {
  return (
    <PageLayout title="Reports">
      <div className="space-y-6">
        <PageHeader
          title="Battle Reports: Your Campaign Intelligence"
          description="Generate comprehensive reports that tell the story of your campaigns. Track progress, identify opportunities, and showcase success."
        />
        {/* Add your report components here */}
      </div>
    </PageLayout>
  );
}
