import { z } from "zod";

export const formSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  campaign_id: z.string().uuid("Invalid campaign ID"),
  age_18_24: z.number().min(0).max(100),
  age_25_34: z.number().min(0).max(100),
  age_35_44: z.number().min(0).max(100),
  age_45_plus: z.number().min(0).max(100),
  gender_male: z.number().min(0).max(100),
  gender_female: z.number().min(0).max(100),
  education_highschool: z.number().min(0).max(100),
  education_bachelors: z.number().min(0).max(100),
  education_masters: z.number().min(0).max(100),
  occupation_professional: z.number().min(0).max(100),
  occupation_student: z.number().min(0).max(100),
  occupation_other: z.number().min(0).max(100),
  marital_single: z.number().min(0).max(100),
  marital_married: z.number().min(0).max(100),
});