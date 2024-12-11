import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface Pattern {
  id: string;
  name: string;
  pattern: string;
  description: string | null;
}

interface PatternCardProps {
  pattern: Pattern;
  onEdit: (pattern: Pattern) => void;
  onDelete: (id: string) => void;
}

export function PatternCard({ pattern, onEdit, onDelete }: PatternCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h3 className="font-medium">{pattern.name}</h3>
        <p className="text-sm text-gray-500">{pattern.pattern}</p>
        {pattern.description && (
          <p className="text-sm text-gray-500 mt-1">{pattern.description}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(pattern)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(pattern.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}