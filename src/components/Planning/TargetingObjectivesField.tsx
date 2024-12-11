import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PlanningFormValues } from "./types";

interface TargetingObjectivesFieldProps {
  form: UseFormReturn<PlanningFormValues>;
}

export function TargetingObjectivesField({ form }: TargetingObjectivesFieldProps) {
  const objectives = form.watch("targeting_objectives") || [];

  const addObjective = () => {
    const currentObjectives = form.getValues("targeting_objectives") || [];
    form.setValue("targeting_objectives", [
      ...currentObjectives,
      { type: "demographic", description: "", priority: "medium" },
    ]);
  };

  const removeObjective = (index: number) => {
    const currentObjectives = form.getValues("targeting_objectives") || [];
    form.setValue(
      "targeting_objectives",
      currentObjectives.filter((_, i) => i !== index)
    );
  };

  return (
    <FormField
      control={form.control}
      name="targeting_objectives"
      render={() => (
        <FormItem>
          <FormLabel>Targeting Objectives</FormLabel>
          <div className="space-y-4">
            {objectives.map((_, index) => (
              <div key={index} className="flex gap-4">
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
                  name={`targeting_objectives.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="flex-[2]">
                      <FormControl>
                        <Input placeholder="Description" {...field} />
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
                            <SelectValue placeholder="Priority" />
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
                  onClick={() => removeObjective(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addObjective}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Targeting Objective
            </Button>
          </div>
        </FormItem>
      )}
    />
  );
}