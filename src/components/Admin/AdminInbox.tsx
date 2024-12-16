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
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function AdminInbox() {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);

  const { data: messages, isLoading, refetch } = useQuery({
    queryKey: ["admin-inbox"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_inbox")
        .select(`
          *,
          profiles:profiles(business_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const markAsRead = async (messageId: string) => {
    try {
      setUpdating(messageId);
      const { error } = await supabase
        .from("admin_inbox")
        .update({ status: "read" })
        .eq("id", messageId);

      if (error) throw error;

      toast({
        title: "Message marked as read",
        description: "The message status has been updated.",
      });
      refetch();
    } catch (error) {
      console.error("Error updating message:", error);
      toast({
        title: "Error updating message",
        description: "There was an error updating the message status.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
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
        <h3 className="text-lg font-medium">User Messages</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages?.map((message) => (
            <TableRow key={message.id}>
              <TableCell>
                {format(new Date(message.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{message.profiles?.business_name || "N/A"}</TableCell>
              <TableCell>{message.subject}</TableCell>
              <TableCell className="max-w-md truncate">{message.message}</TableCell>
              <TableCell>
                <Badge variant={message.status === "unread" ? "destructive" : "default"}>
                  {message.status}
                </Badge>
              </TableCell>
              <TableCell>
                {message.status === "unread" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={updating === message.id}
                    onClick={() => markAsRead(message.id)}
                  >
                    {updating === message.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Mark as Read"
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}