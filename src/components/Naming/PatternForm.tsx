import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  pattern: z.string().min(1, "Pattern is required"),
  description: z.string().optional(),
});

export type PatternFormValues = z.infer<typeof formSchema>;

interface PatternFormProps {
  defaultValues?: PatternFormValues;
  onSubmit: (values: PatternFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function PatternForm({ defaultValues, onSubmit, isSubmitting, onCancel }: PatternFormProps) {
  const form = useForm<PatternFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      pattern: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pattern Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Social Media Campaigns" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pattern"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pattern Template</FormLabel>
              <FormControl>
                <Input placeholder="e.g., {region}_{platform}_{objective}" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Add a description for this pattern" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Pattern"}
          </Button>
        </div>
      </form>
    </Form>
  );
}