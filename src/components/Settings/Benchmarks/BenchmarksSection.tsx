import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndustryBenchmarks } from "./IndustryBenchmarks";
import { CustomKPIs } from "./CustomKPIs";

export const BenchmarksSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Benchmarks & KPIs</h2>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Industry Benchmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <IndustryBenchmarks />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomKPIs />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};