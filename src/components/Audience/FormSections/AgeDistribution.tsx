import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schemas/insightFormSchema";

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
};

export function AgeDistribution({ form }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Age Distribution (%)</h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: "age_18_24", label: "18-24" },
          { name: "age_25_34", label: "25-34" },
          { name: "age_35_44", label: "35-44" },
          { name: "age_45_plus", label: "45+" },
        ].map((age) => (
          <FormField
            key={age.name}
            control={form.control}
            name={age.name as keyof z.infer<typeof formSchema>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{age.label}</FormLabel>
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