import { z } from "zod";

export const nominationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  regNo: z.string().regex(/^\d{12}$/, "Registration Number must be exactly 12 digits"),
  email: z.string().email("Invalid email address").regex(/@/, "Must be a valid email"), // Add specific domain check if needed
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  year: z.enum(["I", "II", "III", "IV"]),
  section: z.enum(["A", "B", "C", "D", "E"]),
  selectedAwards: z.array(z.string()).min(1, "Select at least one award").max(2, "You can select a maximum of two awards"),
});

export type NominationFormData = z.infer<typeof nominationSchema>;
