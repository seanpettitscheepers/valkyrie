import { format } from "date-fns";
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

const ticketTypeLabels = {
  account_support: "Account Support",
  feature_request: "Feature Request",
  technical_support: "Technical Support",
};

interface TicketsTableProps {
  tickets: any[];
  onViewTicket: (ticket: any) => void;
}

export function TicketsTable({ tickets, onViewTicket }: TicketsTableProps) {
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

  return (
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
                onClick={() => onViewTicket(ticket)}
              >
                View & Respond
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}