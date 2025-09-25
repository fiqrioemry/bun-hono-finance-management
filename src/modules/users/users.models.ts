import { z } from "zod";

export const profileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date().transform((date) => date.toISOString().split("T")[0]),
  image: z.string().url(),
});
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 2 characters" }),
  image: z.string().url(),
  file: z.instanceof(File, { message: "Invalid image file" }).optional(),
});

export type ProfileResponse = z.infer<typeof profileSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
