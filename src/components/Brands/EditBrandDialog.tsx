import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface EditBrandDialogProps {
  brand: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBrandDialog({ brand, open, onOpenChange }: EditBrandDialogProps) {
  const [name, setName] = useState(brand.name);
  const [description, setDescription] = useState(brand.description || "");
  const [logo, setLogo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let logoUrl = brand.logo_url;

      if (logo) {
        const fileExt = logo.name.split(".").pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("brand-logos")
          .upload(filePath, logo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("brand-logos")
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      const { error } = await supabase
        .from("brands")
        .update({
          name,
          description,
          logo_url: logoUrl,
        })
        .eq("id", brand.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["brands"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Updating..." : "Update Brand"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}