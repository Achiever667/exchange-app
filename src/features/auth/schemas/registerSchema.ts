import { z } from "zod";
import { DEFAULT_PASSWORD_RULES } from "@/components/ui/field";

export const registerSchema = z
  .object({
    firstname: z
      .string()
      .trim()
      .min(1, "First name is required"),

    lastname: z
      .string()
      .trim()
      .min(1, "Last name is required"),

    username: z
      .string()
      .trim()
      .min(1, "Username is required"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    phone_number: z
      .string()
      .trim()
      .min(1, "Phone number is required"),

    dial_code: z
      .string()
      .trim()
      .min(1, "Dial code is required"),

    country: z
      .string()
      .trim()
      .min(1, "Country is required"),

    password: z
      .string()
      .min(1, "Password is required")
      .refine(
        (val) => DEFAULT_PASSWORD_RULES.every((rule) => rule.test(val)),
        {
          message: "Please meet all password requirements",
        }
      ),

    password_confirmation: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type RegisterCredentials = z.infer<typeof registerSchema>;
