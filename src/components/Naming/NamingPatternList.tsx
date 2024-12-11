import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { CreatePatternSheet } from "./CreatePatternSheet";
import { PatternCard } from "./PatternCard";

interface Pattern {
  id: string;
  name: string;
  pattern: string;
  description: string | null;
}

export function NamingPatternList() {
  const [patternToDelete, setPatternToDelete] = useState<string | null>(null);
  const [patternToEdit, setPatternToEdit] = useState<Pattern | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: patterns, isLoading } = useQuery({
    queryKey: ["naming-patterns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("naming_patterns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Pattern[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("naming_patterns").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["naming-patterns"] });
      toast.success("Pattern deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting pattern:", error);
      toast.error("Failed to delete pattern");
    },
  });

  const handleDelete = async (id: string) => {
    setPatternToDelete(null);
    deleteMutation.mutate(id);
  };

  const handleEdit = (pattern: Pattern) => {
    setPatternToEdit(pattern);
    setIsEditSheetOpen(true);
  };

  if (isLoading) {
    return <div>Loading patterns...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {patterns?.map((pattern) => (
          <PatternCard
            key={pattern.id}
            pattern={pattern}
            onEdit={handleEdit}
            onDelete={(id) => setPatternToDelete(id)}
          />
        ))}
      </div>

      <AlertDialog open={!!patternToDelete} onOpenChange={() => setPatternToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the naming pattern.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => patternToDelete && handleDelete(patternToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreatePatternSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        patternToEdit={patternToEdit}
      />
    </>
  );
}