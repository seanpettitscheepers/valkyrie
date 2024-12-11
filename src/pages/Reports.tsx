import { PageLayout } from "@/components/Layout/PageLayout";
import { ReportBuilder } from "@/components/Reports/ReportBuilder";

export default function Reports() {
  return (
    <PageLayout title="Reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Report Builder</h2>
            <p className="text-muted-foreground">
              Create custom reports by selecting metrics and date ranges
            </p>
          </div>
        </div>
        <ReportBuilder />
      </div>
    </PageLayout>
  );
}