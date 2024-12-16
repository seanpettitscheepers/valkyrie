import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PlanningFormValues, TargetingObjective } from "./types";

interface TargetingObjectivesFieldProps {
  form: UseFormReturn<PlanningFormValues>;
}

export function TargetingObjectivesField({ form }: TargetingObjectivesFieldProps) {
  const targetingObjectives = form.watch("targeting_objectives") || [];

  const addTargetingObjective = () => {
    const currentObjectives = form.getValues("targeting_objectives") || [];
    form.setValue("targeting_objectives", [
      ...currentObjectives,
      { type: "demographic", description: "", priority: "medium" },
    ]);
  };

  const removeTargetingObjective = (index: number) => {
    const currentObjectives = form.getValues("targeting_objectives") || [];
    form.setValue(
      "targeting_objectives",
      currentObjectives.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Targeting Objectives</FormLabel>
        <Button type="button" variant="outline" onClick={addTargetingObjective}>
          Add Objective
        </Button>
      </div>

      {targetingObjectives.map((_, index) => (
        <Card key={index}>
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name={`targeting_objectives.${index}.type`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="demographic">Demographic</SelectItem>
                          <SelectItem value="behavioral">Behavioral</SelectItem>
                          <SelectItem value="interest">Interest</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`targeting_objectives.${index}.priority`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTargetingObjective(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <FormField
              control={form.control}
              name={`targeting_objectives.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter objective description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}