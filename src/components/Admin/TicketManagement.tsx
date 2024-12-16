import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { CreateTicketDialog } from "./Tickets/CreateTicketDialog";
import { ViewTicketDialog } from "./Tickets/ViewTicketDialog";
import { TicketsTable } from "./Tickets/TicketsTable";

export function TicketManagement() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

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

      <TicketsTable 
        tickets={tickets || []} 
        onViewTicket={setSelectedTicket} 
      />

      <CreateTicketDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onTicketCreated={refetch}
      />

      <ViewTicketDialog
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onTicketUpdated={refetch}
      />
    </div>
  );
}