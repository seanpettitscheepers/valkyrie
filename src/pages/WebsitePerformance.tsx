import { PageLayout } from "@/components/Layout/PageLayout";
import { WebsitePerformanceOverview } from "@/components/WebsitePerformance/WebsitePerformanceOverview";
import { CustomerJourneyAnalysis } from "@/components/WebsitePerformance/CustomerJourneyAnalysis";
import { WebsitePerformanceMetrics } from "@/components/WebsitePerformance/WebsitePerformanceMetrics";
import { WebsitePerformanceInsights } from "@/components/WebsitePerformance/WebsitePerformanceInsights";
import { TrafficSourceAnalysis } from "@/components/WebsitePerformance/TrafficSourceAnalysis";
import { DateRangePicker } from "@/components/Reports/DateRangePicker";

export default function WebsitePerformance() {
  return (
    <PageLayout title="Website Performance">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fortify Your Stronghold: Website Insights That Convert.</h1>
          <p className="text-muted-foreground">
            Uncover how your campaigns are driving website traffic and engagement. Monitor visitor behavior and maximize conversions.
          </p>
        </div>
        <div className="flex justify-end">
          <DateRangePicker />
        </div>
        <WebsitePerformanceOverview />
        <div className="grid gap-6 md:grid-cols-2">
          <CustomerJourneyAnalysis />
          <TrafficSourceAnalysis />
        </div>
        <WebsitePerformanceMetrics />
        <WebsitePerformanceInsights />
      </div>
    </PageLayout>
  );
}