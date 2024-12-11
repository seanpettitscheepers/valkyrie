import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const industries = [
  { value: "e_commerce", label: "E-Commerce" },
  { value: "b2b_saas", label: "B2B SaaS" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "retail", label: "Retail" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];

export const IndustryBenchmarks = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("e_commerce");

  const { data: benchmarks, isLoading } = useQuery({
    queryKey: ["industry-benchmarks", selectedIndustry],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("industry_benchmarks")
        .select("*")
        .eq("industry", selectedIndustry);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Industry Benchmarks</h3>
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry.value} value={industry.value}>
                {industry.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead>Baseline Value</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            benchmarks?.map((benchmark) => (
              <TableRow key={benchmark.id}>
                <TableCell className="font-medium">
                  {benchmark.metric_name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </TableCell>
                <TableCell>{benchmark.baseline_value}</TableCell>
                <TableCell>{benchmark.unit}</TableCell>
                <TableCell>{benchmark.description}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};