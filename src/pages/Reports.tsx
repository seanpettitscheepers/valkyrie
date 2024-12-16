import { PageLayout } from "@/components/Layout/PageLayout";
import { ReportBuilder } from "@/components/Reports/ReportBuilder";

export default function Reports() {
  return (
    <PageLayout title="Reports">
      <div className="space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Victory in Numbers: Campaign Reports Simplified.</h1>
          <p className="text-muted-foreground">
            Access detailed, exportable reports that tell the story of your campaigns. From ROI to audience impact, get insights you can act on.
          </p>
        </div>
        <ReportBuilder />
      </div>
    </PageLayout>
  );
}