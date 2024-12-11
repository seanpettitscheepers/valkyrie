import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schemas/insightFormSchema";

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
};

export function EducationDistribution({ form }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Education (%)</h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: "education_highschool", label: "High School" },
          { name: "education_bachelors", label: "Bachelor's" },
          { name: "education_masters", label: "Master's" },
        ].map((education) => (
          <FormField
            key={education.name}
            control={form.control}
            name={education.name as keyof z.infer<typeof formSchema>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{education.label}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}