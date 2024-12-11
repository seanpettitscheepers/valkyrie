import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  pattern: z.string().min(1, "Pattern is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Pattern {
  id: string;
  name: string;
  pattern: string;
  description: string | null;
}

interface CreatePatternSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patternToEdit?: Pattern | null;
}

export function CreatePatternSheet({ open, onOpenChange, patternToEdit }: CreatePatternSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      pattern: "",
      description: "",
    },
  });

  useEffect(() => {
    if (patternToEdit) {
      form.reset({
        name: patternToEdit.name,
        pattern: patternToEdit.pattern,
        description: patternToEdit.description || "",
      });
    } else {
      form.reset({
        name: "",
        pattern: "",
        description: "",
      });
    }
  }, [patternToEdit, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (patternToEdit) {
        const { error } = await supabase
          .from("naming_patterns")
          .update({
            name: values.name,
            pattern: values.pattern,
            description: values.description || null,
          })
          .eq("id", patternToEdit.id);

        if (error) throw error;
        toast.success("Pattern updated successfully");
      } else {
        const { error } = await supabase
          .from("naming_patterns")
          .insert({
            name: values.name,
            pattern: values.pattern,
            description: values.description || null,
          });

        if (error) throw error;
        toast.success("Pattern created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["naming-patterns"] });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(patternToEdit ? "Failed to update pattern" : "Failed to create pattern");
      console.error("Error saving pattern:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{patternToEdit ? "Edit Naming Pattern" : "Create New Naming Pattern"}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
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
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? (patternToEdit ? "Updating..." : "Creating...") 
                  : (patternToEdit ? "Update Pattern" : "Create Pattern")}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}