import { useState } from "react";
import { DateRange } from "react-day-picker";
import { PageLayout } from "@/components/Layout/PageLayout";
import { SentimentHeader } from "@/components/Sentiment/SentimentHeader";
import { SentimentFilters } from "@/components/Sentiment/SentimentFilters";
import { SentimentContent } from "@/components/Sentiment/SentimentContent";

const Sentiment = () => {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>();

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
  };

  return (
    <PageLayout title="Brand Sentiment">
      <SentimentHeader />
      <SentimentFilters
        selectedCampaign={selectedCampaign}
        onCampaignChange={setSelectedCampaign}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={handleDateRangeChange}
      />
      <SentimentContent
        campaignId={selectedCampaign}
        platform={selectedPlatform}
        dateRange={selectedDateRange}
      />
    </PageLayout>
  );
};

export default Sentiment;