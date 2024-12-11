import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PlanningFormValues } from "./types";

interface PlatformsFieldProps {
  form: UseFormReturn<PlanningFormValues>;
}

export function PlatformsField({ form }: PlatformsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="platforms"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Platforms</FormLabel>
          <Select
            onValueChange={(value) => {
              const currentPlatforms = field.value || [];
              if (currentPlatforms.includes(value)) {
                field.onChange(currentPlatforms.filter((p) => p !== value));
              } else {
                field.onChange([...currentPlatforms, value]);
              }
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select platforms" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {field.value?.map((platform) => (
              <Button
                key={platform}
                variant="secondary"
                size="sm"
                onClick={() => {
                  field.onChange(field.value?.filter((p) => p !== platform));
                }}
              >
                {platform} ×
              </Button>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}