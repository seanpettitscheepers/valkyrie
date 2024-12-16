import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { PlanningFormValues, objectiveDescriptions } from "./types";

interface ObjectiveSelectionProps {
  form: UseFormReturn<PlanningFormValues>;
}

export function ObjectiveSelection({ form }: ObjectiveSelectionProps) {
  return (
    <FormField
      control={form.control}
      name="objective"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-semibold">Campaign Objective</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {(Object.keys(objectiveDescriptions) as Array<keyof typeof objectiveDescriptions>).map(
                (objective) => (
                  <Card
                    key={objective}
                    className={`cursor-pointer transition-all ${
                      field.value === objective ? "border-primary" : ""
                    }`}
                    onClick={() => field.onChange(objective)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {objectiveDescriptions[objective].title}
                      </CardTitle>
                      <CardDescription>
                        {objectiveDescriptions[objective].description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Examples:</div>
                        <ul className="text-sm text-muted-foreground list-disc pl-4">
                          {objectiveDescriptions[objective].examples.map((example, index) => (
                            <li key={index}>{example}</li>
                          ))}
                        </ul>
                      </div>
                      <RadioGroupItem
                        value={objective}
                        className="sr-only"
                        aria-label={objectiveDescriptions[objective].title}
                      />
                    </CardContent>
                  </Card>
                )
              )}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}