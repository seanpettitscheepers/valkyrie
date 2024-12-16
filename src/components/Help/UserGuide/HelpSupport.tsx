import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HelpSupport() {
  return (
    <section id="help-support" className="space-y-6">
      <h2 className="text-2xl font-semibold">10. Help and Support</h2>

      <Card>
        <CardHeader>
          <CardTitle>FAQs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Check the Help Center for answers to common questions about features, integrations, and troubleshooting.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contacting Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            For additional assistance, email{" "}
            <a href="mailto:support@valkyriehub.com" className="text-primary hover:underline">
              support@valkyriehub.com
            </a>
            {" "}or use the live chat feature within the app.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}