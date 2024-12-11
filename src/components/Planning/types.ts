import { z } from "zod";

export const targetingObjectiveSchema = z.object({
  type: z.enum(["demographic", "behavioral", "interest"]),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["high", "medium", "low"]),
});

export const planningFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  objective: z.enum(["awareness", "consideration", "conversion"]),
  total_budget: z.number().min(0),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  audience_insights_id: z.string().uuid().optional(),
  previous_campaign_id: z.string().uuid().optional(),
  notes: z.string().optional(),
  targeting_objectives: z.array(targetingObjectiveSchema),
});

export type PlanningFormValues = z.infer<typeof planningFormSchema>;
export type TargetingObjective = z.infer<typeof targetingObjectiveSchema>;