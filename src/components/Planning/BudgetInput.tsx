import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useConnectedPlatforms } from "@/hooks/useConnectedPlatforms";
import { UseFormReturn } from "react-hook-form";
import { PlanningFormValues, BudgetCap } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface BudgetInputProps {
  form: UseFormReturn<PlanningFormValues>;
}

export function BudgetInput({ form }: BudgetInputProps) {
  const { data: platforms, isLoading } = useConnectedPlatforms();
  const budgetCaps = form.watch("budget_caps") || [];

  const addBudgetCap = () => {
    const currentCaps = form.getValues("budget_caps") || [];
    form.setValue("budget_caps", [
      ...currentCaps,
      { platform: platforms?.[0]?.value || "", amount: 0 },
    ]);
  };

  const removeBudgetCap = (index: number) => {
    const currentCaps = form.getValues("budget_caps") || [];
    form.setValue(
      "budget_caps",
      currentCaps.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="total_budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Campaign Budget</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter total budget"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Platform Budget Caps (Optional)</FormLabel>
          <Button type="button" variant="outline" onClick={addBudgetCap} disabled={isLoading}>
            Add Budget Cap
          </Button>
        </div>

        {budgetCaps.map((_, index) => (
          <Card key={index}>
            <CardContent className="pt-6 flex gap-4">
              <FormField
                control={form.control}
                name={`budget_caps.${index}.platform`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...field}
                        disabled={isLoading}
                      >
                        {platforms?.map((platform) => (
                          <option key={platform.value} value={platform.value}>
                            {platform.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`budget_caps.${index}.amount`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter cap amount"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBudgetCap(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}