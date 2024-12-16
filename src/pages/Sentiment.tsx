import { PageLayout } from "@/components/Layout/PageLayout";
import { SentimentHeader } from "@/components/Sentiment/SentimentHeader";
import { SentimentFilters } from "@/components/Sentiment/SentimentFilters";
import { SentimentContent } from "@/components/Sentiment/SentimentContent";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const Sentiment = () => {
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>();

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return (
    <PageLayout title="Brand Sentiment">
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Protect Your Banner: Monitor Your Brand's Reputation.</h1>
            <p className="text-muted-foreground">
              Keep your finger on the pulse of how your brand is perceived. Identify risks, respond to trends, and maintain a positive presence in the digital battlefield.
            </p>
          </div>
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
        </div>
      </div>
    </PageLayout>
  );
};

export default Sentiment;