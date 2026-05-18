import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};

export const insertCoralSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  image: z.string().trim().min(1, "Image URL is required"),
  description: z.string().trim().default(""),
  price: z.coerce.number().int().positive("Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
});

export const updateCoralSchema = insertCoralSchema.partial();

export type InsertCoral = z.infer<typeof insertCoralSchema>;
export type UpdateCoral = z.infer<typeof updateCoralSchema>;
export type Coral = InsertCoral & { id: string };

export const adoptionRequestSchema = z.object({
  coralId: z.string().min(1, "Pick a coral"),
  amount: z.coerce.number().int().positive("Amount must be positive"),
});

export type AdoptionRequest = z.infer<typeof adoptionRequestSchema>;
export type Adoption = {
  id: string;
  userId: string;
  coralId: string | null;
  coralName: string;
  coralImage: string;
  amount: number;
  price: number;
  adoptedAt: string;
};

export const insertDonationSchema = z.object({
  amount: z.coerce
    .number()
    .int()
    .min(1, "Minimum donation is $1")
    .max(100000, "Maximum donation is $100,000"),
  donorName: z.string().trim().optional(),
  donorEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = InsertDonation & {
  id: string;
  userId: string;
  donatedAt: string;
};

export const VOLUNTEER_STATUSES = ["open", "closed", "completed", "ongoing", "cancelled"] as const;
export type VolunteerStatus = (typeof VOLUNTEER_STATUSES)[number];

export const VOLUNTEER_CATEGORIES = ["cleanup", "replanting", "survey", "outreach", "other"] as const;
export type VolunteerCategory = (typeof VOLUNTEER_CATEGORIES)[number];

export const insertVolunteerWorkSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  location: z.string().trim().min(1, "Location is required"),
  hours: z.coerce.number().int().positive("Hours must be positive"),
  scheduledFor: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  status: z.enum(VOLUNTEER_STATUSES).default("open"),
  category: z.enum(VOLUNTEER_CATEGORIES).default("other"),
  maxVolunteers: z.coerce.number().int().positive().optional().nullable(),
});

export const updateVolunteerWorkSchema = insertVolunteerWorkSchema.partial();

export type InsertVolunteerWork = z.infer<typeof insertVolunteerWorkSchema>;
export type UpdateVolunteerWork = z.infer<typeof updateVolunteerWorkSchema>;
export type VolunteerWork = InsertVolunteerWork & { id: string };

export type VolunteerSignup = {
  id: string;
  userId: string;
  workId: string;
  signedUpAt: string;
};

export const EXPENSE_CATEGORIES = [
  { id: "restoration", label: "Coral Restoration", percent: 45, color: "#21bcee" },
  { id: "cleanup", label: "Reef Cleanup", percent: 25, color: "#116bf8" },
  { id: "education", label: "Marine Education", percent: 15, color: "#7c3aed" },
  { id: "equipment", label: "Equipment & Boats", percent: 10, color: "#f59e0b" },
  { id: "operations", label: "Operations", percent: 5, color: "#94a3b8" },
] as const;

export type ExpenseBreakdown = {
  totalRaised: number;
  categories: Array<{
    id: string;
    label: string;
    percent: number;
    color: string;
    amount: number;
  }>;
};
