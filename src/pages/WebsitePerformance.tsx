import { PageLayout } from "@/components/Layout/PageLayout";
import { WebsitePerformanceOverview } from "@/components/WebsitePerformance/WebsitePerformanceOverview";
import { CustomerJourneyAnalysis } from "@/components/WebsitePerformance/CustomerJourneyAnalysis";
import { WebsitePerformanceMetrics } from "@/components/WebsitePerformance/WebsitePerformanceMetrics";
import { WebsitePerformanceInsights } from "@/components/WebsitePerformance/WebsitePerformanceInsights";
import { DateRangePicker } from "@/components/Reports/DateRangePicker";

export default function WebsitePerformance() {
  return (
    <PageLayout title="Website Performance">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Website Performance Analytics</h1>
            <p className="text-muted-foreground">
              Analyze website performance metrics and user behavior to optimize your digital presence.
            </p>
          </div>
          <DateRangePicker />
        </div>
        <WebsitePerformanceOverview />
        <CustomerJourneyAnalysis />
        <WebsitePerformanceMetrics />
        <WebsitePerformanceInsights />
      </div>
    </PageLayout>
  );
}