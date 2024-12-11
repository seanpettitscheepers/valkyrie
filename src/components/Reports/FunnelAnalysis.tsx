import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";

export function FunnelAnalysis() {
  const funnelData = {
    current: {
      total: 1200,
      steps: [
        { name: "visit_website", value: 900, percentage: 75 },
        { name: "sign_in", value: 450, percentage: 28 },
        { name: "buy_products", value: 150, percentage: 12 },
      ]
    },
    previous: {
      total: 1100,
      steps: [
        { name: "visit_website", value: 600, percentage: 54 },
        { name: "sign_in", value: 350, percentage: 31 },
        { name: "buy_products", value: 120, percentage: 11 },
      ]
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" className="gap-1">
          Compare to Previous period
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="relative h-[400px] bg-gradient-to-b from-primary/20 to-background rounded-lg p-4">
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            {funnelData.current.steps.map((step, index) => (
              <div key={step.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{step.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{step.value}</span>
                  <span className="text-sm text-muted-foreground">{step.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[400px] bg-gradient-to-b from-primary/10 to-background rounded-lg p-4">
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            {funnelData.previous.steps.map((step, index) => (
              <div key={step.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{step.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{step.value}</span>
                  <span className="text-sm text-muted-foreground">{step.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Detailed List</h3>
          <Input placeholder="Search" className="w-[200px]" />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Events on page</TableHead>
              <TableHead>Aug 01</TableHead>
              <TableHead>Aug 02</TableHead>
              <TableHead>Aug 05</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>visit_website</TableCell>
              <TableCell>376 • 100%</TableCell>
              <TableCell>406 • 100%</TableCell>
              <TableCell>509 • 100%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>sign_in</TableCell>
              <TableCell>267 • 75%</TableCell>
              <TableCell>327 • 75%</TableCell>
              <TableCell>552 • 75%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3</TableCell>
              <TableCell>buy_products</TableCell>
              <TableCell>167 • 30%</TableCell>
              <TableCell>251 • 30%</TableCell>
              <TableCell>169 • 30%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}