import { PageLayout } from "@/components/Layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const ticketFormSchema = z.object({
  type: z.enum(['account_support', 'feature_request', 'technical_support'], {
    required_error: "Please select a ticket type",
  }),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

const ticketTypeLabels = {
  account_support: "Account Support",
  feature_request: "Feature Request",
  technical_support: "Technical Support",
};

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: TicketFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a ticket",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          type: data.type,
          subject: data.subject,
          message: data.message,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your ticket has been submitted. We'll get back to you soon!",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit ticket. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout title="Contact Us">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              Have a question or need help? We're here to assist you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Support</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the type of support you need" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ticketTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of your request" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please provide details about your request..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Submit Ticket
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}