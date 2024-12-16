import { PageLayout } from "@/components/Layout/PageLayout";
import { WebsitePerformanceOverview } from "@/components/WebsitePerformance/WebsitePerformanceOverview";
import { CustomerJourneyAnalysis } from "@/components/WebsitePerformance/CustomerJourneyAnalysis";
import { WebsitePerformanceMetrics } from "@/components/WebsitePerformance/WebsitePerformanceMetrics";
import { WebsitePerformanceInsights } from "@/components/WebsitePerformance/WebsitePerformanceInsights";
import { TrafficSourceAnalysis } from "@/components/WebsitePerformance/TrafficSourceAnalysis";
import { DateRangePicker } from "@/components/Reports/DateRangePicker";
import { PageHeader } from "@/components/ui/page-header";

export default function WebsitePerformance() {
  return (
    <PageLayout title="Website Performance">
      <div className="space-y-6">
        <PageHeader
          title="Fortify Your Stronghold: Website Insights That Convert"
          description="Uncover how your campaigns are driving website traffic and engagement. Monitor visitor behavior and maximize conversions."
        />
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
