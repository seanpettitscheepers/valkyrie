import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

const ticketTypeLabels = {
  account_support: "Account Support",
  feature_request: "Feature Request",
  technical_support: "Technical Support",
};

export function TicketManagement() {
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({
    business_id: "",
    type: "",
    subject: "",
    message: "",
    status: "open",
  });

  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select(`
          *,
          profiles:profiles(business_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
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

  const handleRespond = async () => {
    if (!selectedTicket || !response.trim()) return;

    try {
      setUpdating(selectedTicket.id);
      const { error } = await supabase
        .from("tickets")
        .update({
          status: "resolved",
          admin_response: response,
        })
        .eq("id", selectedTicket.id);

      if (error) throw error;

      toast({
        title: "Response sent",
        description: "The ticket has been updated with your response.",
      });
      
      setSelectedTicket(null);
      setResponse("");
      refetch();
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error updating ticket",
        description: "There was an error sending your response.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

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
      
      setShowCreateDialog(false);
      setNewTicket({
        business_id: "",
        type: "",
        subject: "",
        message: "",
        status: "open",
      });
      refetch();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error creating ticket",
        description: "There was an error creating the ticket.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Support Tickets</h3>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets?.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>
                {format(new Date(ticket.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{ticket.profiles?.business_name || "N/A"}</TableCell>
              <TableCell>{ticketTypeLabels[ticket.type as keyof typeof ticketTypeLabels]}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>{getStatusBadge(ticket.status)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  View & Respond
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Ticket Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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
              onClick={() => setShowCreateDialog(false)}
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

      {/* View & Respond Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Subject</p>
              <p className="text-sm text-gray-500">{selectedTicket?.subject}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Message</p>
              <p className="text-sm text-gray-500">{selectedTicket?.message}</p>
            </div>
            {selectedTicket?.admin_response && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Previous Response</p>
                <p className="text-sm text-gray-500">{selectedTicket.admin_response}</p>
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
              disabled={updating === selectedTicket?.id || !response.trim()}
              onClick={handleRespond}
            >
              {updating === selectedTicket?.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send Response"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}