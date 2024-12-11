import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SentimentFiltersProps {
  onChannelChange: (channel: string) => void;
  onBrandChange: (brand: string) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  selectedChannel: string;
  selectedBrand: string;
  dateRange: DateRange | undefined;
}

export function SentimentFilters({
  onChannelChange,
  onBrandChange,
  onDateRangeChange,
  selectedChannel,
  selectedBrand,
  dateRange,
}: SentimentFiltersProps) {
  const [date, setDate] = useState<DateRange | undefined>(
    dateRange || {
      from: new Date(),
      to: addDays(new Date(), 7),
    }
  );

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select value={selectedChannel} onValueChange={onChannelChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select channel" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Channels</SelectItem>
          <SelectItem value="Facebook">Facebook</SelectItem>
          <SelectItem value="Instagram">Instagram</SelectItem>
          <SelectItem value="Twitter">Twitter</SelectItem>
          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedBrand} onValueChange={onBrandChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Brands</SelectItem>
          <SelectItem value="brand1">Brand 1</SelectItem>
          <SelectItem value="brand2">Brand 2</SelectItem>
          <SelectItem value="brand3">Brand 3</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              onDateRangeChange(newDate);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}