import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PatternForm, PatternFormValues } from "./PatternForm";

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

  const onSubmit = async (values: PatternFormValues) => {
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

        <div className="mt-6">
          <PatternForm
            defaultValues={patternToEdit ? {
              name: patternToEdit.name,
              pattern: patternToEdit.pattern,
              description: patternToEdit.description || "",
            } : undefined}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}