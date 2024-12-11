import { useState } from "react";
import { DateRange } from "react-day-picker";
import { PageLayout } from "@/components/Layout/PageLayout";
import { SentimentHeader } from "@/components/Sentiment/SentimentHeader";
import { SentimentFilters } from "@/components/Sentiment/SentimentFilters";
import { SentimentContent } from "@/components/Sentiment/SentimentContent";

const Sentiment = () => {
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>();

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return (
    <PageLayout title="Brand Sentiment">
      <SentimentHeader />
      <SentimentFilters
        selectedChannel={selectedChannel}
        onChannelChange={setSelectedChannel}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />
      <SentimentContent
        isLoading={false}
        sentimentData={[]}
        selectedChannel={selectedChannel}
        dateRange={dateRange}
      />
    </PageLayout>
  );
};

export default Sentiment;