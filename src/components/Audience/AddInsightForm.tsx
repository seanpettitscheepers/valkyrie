import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  campaign_id: z.string().uuid("Invalid campaign ID"),
  age_18_24: z.string().transform(Number),
  age_25_34: z.string().transform(Number),
  age_35_44: z.string().transform(Number),
  age_45_plus: z.string().transform(Number),
  gender_male: z.string().transform(Number),
  gender_female: z.string().transform(Number),
  education_highschool: z.string().transform(Number),
  education_bachelors: z.string().transform(Number),
  education_masters: z.string().transform(Number),
  occupation_professional: z.string().transform(Number),
  occupation_student: z.string().transform(Number),
  occupation_other: z.string().transform(Number),
  marital_single: z.string().transform(Number),
  marital_married: z.string().transform(Number),
});

export function AddInsightForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: "",
      campaign_id: "",
      age_18_24: "0",
      age_25_34: "0",
      age_35_44: "0",
      age_45_plus: "0",
      gender_male: "0",
      gender_female: "0",
      education_highschool: "0",
      education_bachelors: "0",
      education_masters: "0",
      occupation_professional: "0",
      occupation_student: "0",
      occupation_other: "0",
      marital_single: "0",
      marital_married: "0",
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

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Age Distribution (%)</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "age_18_24", label: "18-24" },
              { name: "age_25_34", label: "25-34" },
              { name: "age_35_44", label: "35-44" },
              { name: "age_45_plus", label: "45+" },
            ].map((age) => (
              <FormField
                key={age.name}
                control={form.control}
                name={age.name as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{age.label}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Gender Distribution (%)</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "gender_male", label: "Male" },
              { name: "gender_female", label: "Female" },
            ].map((gender) => (
              <FormField
                key={gender.name}
                control={form.control}
                name={gender.name as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{gender.label}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Education (%)</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "education_highschool", label: "High School" },
              { name: "education_bachelors", label: "Bachelor's" },
              { name: "education_masters", label: "Master's" },
            ].map((education) => (
              <FormField
                key={education.name}
                control={form.control}
                name={education.name as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{education.label}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Occupation (%)</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "occupation_professional", label: "Professional" },
              { name: "occupation_student", label: "Student" },
              { name: "occupation_other", label: "Other" },
            ].map((occupation) => (
              <FormField
                key={occupation.name}
                control={form.control}
                name={occupation.name as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{occupation.label}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Marital Status (%)</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "marital_single", label: "Single" },
              { name: "marital_married", label: "Married" },
            ].map((status) => (
              <FormField
                key={status.name}
                control={form.control}
                name={status.name as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{status.label}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Add Audience Insight
        </Button>
      </form>
    </Form>
  );
}