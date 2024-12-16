import { z } from "zod";

export const targetingObjectiveSchema = z.object({
  type: z.enum(["demographic", "behavioral", "interest"]),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["high", "medium", "low"]),
});

export const budgetCapSchema = z.object({
  platform: z.string(),
  amount: z.number().min(0),
});

export const planningFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  objective: z.enum(["awareness", "consideration", "conversion"]),
  total_budget: z.number().min(0),
  budget_caps: z.array(budgetCapSchema).optional(),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  geographical_targeting: z.array(z.string()).optional(),
  audience_insights_id: z.string().uuid().optional(),
  previous_campaign_id: z.string().uuid().optional(),
  notes: z.string().optional(),
  targeting_objectives: z.array(targetingObjectiveSchema),
  ad_formats: z.array(z.string()).optional(),
});

export type PlanningFormValues = z.infer<typeof planningFormSchema>;
export type TargetingObjective = z.infer<typeof targetingObjectiveSchema>;
export type BudgetCap = z.infer<typeof budgetCapSchema>;

export const objectiveDescriptions = {
  awareness: {
    title: "Brand Awareness",
    description: "Increase visibility and reach new audiences",
    examples: ["Launching a new product", "Building brand recognition", "Reaching new market segments"],
  },
  consideration: {
    title: "Consideration",
    description: "Drive engagement and interest in your products or services",
    examples: ["Promoting content", "Increasing website visits", "Growing social media engagement"],
  },
  conversion: {
    title: "Conversion",
    description: "Generate leads, sales, or specific actions",
    examples: ["Online sales", "Lead generation", "App installs"],
  },
};

export const adFormatOptions = [
  { value: "image", label: "Image Ads" },
  { value: "video", label: "Video Ads" },
  { value: "carousel", label: "Carousel Ads" },
  { value: "story", label: "Story Ads" },
  { value: "collection", label: "Collection Ads" },
];