import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OptimizationAI() {
  return (
    <section id="optimization" className="space-y-6">
      <h2 className="text-2xl font-semibold">7. Optimization with AI</h2>

      <Card>
        <CardHeader>
          <CardTitle>ChatGPT-Driven Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Valkyrie uses AI to provide tailored recommendations, including:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Adjusting budgets for underperforming or overperforming campaigns.</li>
            <li>Refining audience targeting.</li>
            <li>Improving ad creatives.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementing Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Review AI recommendations in the Alerts & Recommendations section.</li>
            <li>Click Apply to implement changes automatically or modify the suggestions manually.</li>
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}