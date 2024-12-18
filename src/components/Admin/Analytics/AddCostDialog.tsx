import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function AddCostDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const { toast } = useToast();

  const handleAddCost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const costData = {
      date: formData.get('date'),
      category: formData.get('category'),
      amount: formData.get('amount'),
      description: formData.get('description'),
      cost_type: formData.get('cost_type'),
      is_recurring: isRecurring,
      recurrence_frequency: isRecurring ? formData.get('recurrence_frequency') : null,
      recurrence_end_date: isRecurring ? formData.get('recurrence_end_date') : null
    };

    const { error } = await supabase
      .from('business_costs')
      .insert(costData);

    if (error) {
      toast({
        title: "Error adding cost",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Cost added successfully",
        description: "The business cost has been recorded."
      });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Cost
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Business Cost</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddCost} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input type="date" id="date" name="date" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cost_type">Cost Type</Label>
            <Select name="cost_type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select cost type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input type="number" id="amount" name="amount" required min="0" step="0.01" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="is_recurring">Recurring Cost</Label>
          </div>

          {isRecurring && (
            <>
              <div className="space-y-2">
                <Label htmlFor="recurrence_frequency">Frequency</Label>
                <Select name="recurrence_frequency" required={isRecurring}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurrence_end_date">End Date</Label>
                <Input 
                  type="date" 
                  id="recurrence_end_date" 
                  name="recurrence_end_date" 
                  required={isRecurring}
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full">Add Cost</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}