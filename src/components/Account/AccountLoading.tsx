import { Loader2 } from "lucide-react";

export function AccountLoading() {
  return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}