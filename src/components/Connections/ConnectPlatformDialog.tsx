import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConnectPlatformDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectPlatformDialog({ open, onOpenChange }: ConnectPlatformDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Platform</DialogTitle>
          <DialogDescription>
            Choose a platform to connect to your account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Add platform connection options here */}
          <p className="text-muted-foreground">Platform connection options will be displayed here</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}