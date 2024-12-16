import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const ticketTypeLabels = {
  account_support: "Account Support",
  feature_request: "Feature Request",
  technical_support: "Technical Support",
};

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated: () => void;
}

export function CreateTicketDialog({ open, onOpenChange, onTicketCreated }: CreateTicketDialogProps) {
  const { toast } = useToast();
  const [newTicket, setNewTicket] = useState({
    business_id: "",
    type: "",
    subject: "",
    message: "",
    status: "open",
  });

  const { data: businesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, business_name")
        .not("business_name", "is", null);

      if (error) throw error;
      return data;
    },
  });

  const handleCreateTicket = async () => {
    try {
      const { error } = await supabase
        .from("tickets")
        .insert({
          user_id: newTicket.business_id,
          type: newTicket.type,
          subject: newTicket.subject,
          message: newTicket.message,
          status: newTicket.status,
        });

      if (error) throw error;

      toast({
        title: "Ticket created",
        description: "The ticket has been created successfully.",
      });
      
      onOpenChange(false);
      setNewTicket({
        business_id: "",
        type: "",
        subject: "",
        message: "",
        status: "open",
      });
      onTicketCreated();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error creating ticket",
        description: "There was an error creating the ticket.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Business</Label>
            <Select
              value={newTicket.business_id}
              onValueChange={(value) => setNewTicket({ ...newTicket, business_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a business" />
              </SelectTrigger>
              <SelectContent>
                {businesses?.map((business) => (
                  <SelectItem key={business.id} value={business.id}>
                    {business.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={newTicket.type}
              onValueChange={(value) => setNewTicket({ ...newTicket, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ticket type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ticketTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={newTicket.status}
              onValueChange={(value) => setNewTicket({ ...newTicket, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              value={newTicket.subject}
              onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              placeholder="Enter ticket subject"
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={newTicket.message}
              onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
              placeholder="Enter ticket message"
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTicket}
            disabled={!newTicket.business_id || !newTicket.type || !newTicket.subject || !newTicket.message}
          >
            Create Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}