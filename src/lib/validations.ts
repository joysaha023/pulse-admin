import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const customerUpdateSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().trim().email("Enter a valid email address"),
  company: z.string().trim().min(1, "Company is required"),
  plan: z.enum(["free", "pro", "enterprise"]),
  status: z.enum(["active", "inactive", "churned"]),
});
export type CustomerUpdate = z.infer<typeof customerUpdateSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().trim().email("Enter a valid email address"),
});
export type ProfileInput = z.infer<typeof profileSchema>;
