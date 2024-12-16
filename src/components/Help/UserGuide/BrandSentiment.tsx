import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BrandSentiment() {
  return (
    <section id="brand-sentiment" className="space-y-6">
      <h2 className="text-2xl font-semibold">8. Brand Sentiment and Risk Analysis</h2>

      <Card>
        <CardHeader>
          <CardTitle>Monitoring Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to the Brand Sentiment tab.</li>
            <li>View sentiment trends (positive, neutral, negative) across platforms.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Identifying and Managing Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Valkyrie will notify you of potential brand risks, such as spikes in negative sentiment or high-risk mentions.</li>
            <li>Follow actionable recommendations to address issues before they escalate.</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}