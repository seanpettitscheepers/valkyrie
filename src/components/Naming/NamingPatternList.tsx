import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

export function NamingPatternList() {
  const { data: patterns, isLoading } = useQuery({
    queryKey: ["naming-patterns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("naming_patterns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading patterns...</div>;
  }

  return (
    <div className="space-y-4">
      {patterns?.map((pattern) => (
        <div
          key={pattern.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <h3 className="font-medium">{pattern.name}</h3>
            <p className="text-sm text-gray-500">{pattern.pattern}</p>
            {pattern.description && (
              <p className="text-sm text-gray-500 mt-1">{pattern.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}