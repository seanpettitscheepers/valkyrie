import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Step {
  title: string;
  instructions: string[];
}

interface PlatformGuideProps {
  platform: string;
  description?: string;
  steps: Step[];
}

export function PlatformGuide({ platform, description, steps }: PlatformGuideProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{platform}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {steps.map((step, index) => (
            <AccordionItem key={index} value={`step-${index + 1}`}>
              <AccordionTrigger>Step {index + 1}: {step.title}</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal pl-6 space-y-2">
                  {step.instructions.map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}