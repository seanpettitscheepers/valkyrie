import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ViewTicketDialogProps {
  ticket: any;
  onClose: () => void;
  onTicketUpdated: () => void;
}

export function ViewTicketDialog({ ticket, onClose, onTicketUpdated }: ViewTicketDialogProps) {
  const { toast } = useToast();
  const [response, setResponse] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleRespond = async () => {
    if (!ticket || !response.trim()) return;

    try {
      setUpdating(true);
      const { error } = await supabase
        .from("tickets")
        .update({
          status: "resolved",
          admin_response: response,
        })
        .eq("id", ticket.id);

      if (error) throw error;

      toast({
        title: "Response sent",
        description: "The ticket has been updated with your response.",
      });
      
      onClose();
      onTicketUpdated();
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error updating ticket",
        description: "There was an error sending your response.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={!!ticket} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ticket Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Subject</p>
            <p className="text-sm text-gray-500">{ticket?.subject}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Message</p>
            <p className="text-sm text-gray-500">{ticket?.message}</p>
          </div>
          {ticket?.admin_response && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Previous Response</p>
              <p className="text-sm text-gray-500">{ticket.admin_response}</p>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium">Your Response</p>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response here..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={updating || !response.trim()}
            onClick={handleRespond}
          >
            {updating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send Response"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}