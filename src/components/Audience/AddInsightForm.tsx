import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { AgeDistribution } from "./FormSections/AgeDistribution";
import { GenderDistribution } from "./FormSections/GenderDistribution";
import { EducationDistribution } from "./FormSections/EducationDistribution";
import { formSchema } from "./schemas/insightFormSchema";
import { z } from "zod";

export function AddInsightForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: "",
      campaign_id: "",
      age_18_24: 0,
      age_25_34: 0,
      age_35_44: 0,
      age_45_plus: 0,
      gender_male: 0,
      gender_female: 0,
      education_highschool: 0,
      education_bachelors: 0,
      education_masters: 0,
      occupation_professional: 0,
      occupation_student: 0,
      occupation_other: 0,
      marital_single: 0,
      marital_married: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const demographicsData = {
        age: {
          "18-24": values.age_18_24,
          "25-34": values.age_25_34,
          "35-44": values.age_35_44,
          "45+": values.age_45_plus,
        },
        gender: {
          male: values.gender_male,
          female: values.gender_female,
        },
        education: {
          highschool: values.education_highschool,
          bachelors: values.education_bachelors,
          masters: values.education_masters,
        },
        occupation: {
          professional: values.occupation_professional,
          student: values.occupation_student,
          other: values.occupation_other,
        },
        marital_status: {
          single: values.marital_single,
          married: values.marital_married,
        },
      };

      const { error } = await supabase.from("audience_insights").insert({
        platform: values.platform,
        campaign_id: values.campaign_id,
        demographics: demographicsData,
        interests: {},
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Audience insight has been added successfully.",
      });

      form.reset();
    } catch (error) {
      console.error("Error adding insight:", error);
      toast({
        title: "Error",
        description: "Failed to add audience insight. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="campaign_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AgeDistribution form={form} />
        <GenderDistribution form={form} />
        <EducationDistribution form={form} />

        <Button type="submit" className="w-full">
          Add Audience Insight
        </Button>
      </form>
    </Form>
  );
}