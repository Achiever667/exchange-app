import { z } from "zod";
import { DEFAULT_PASSWORD_RULES } from "@/components/ui/field";

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(1, "First name is required"),

    last_name: z
      .string()
      .trim()
      .min(1, "Last name is required"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    phone_number: z
      .string()
      .trim()
      .min(1, "Phone number is required"),

    password: z
      .string()
      .min(1, "Password is required")
      .refine(
        (val) => DEFAULT_PASSWORD_RULES.every((rule) => rule.test(val)),
        {
          message: "Please meet all password requirements",
        }
      ),

    confirm_password: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterCredentials = z.infer<typeof registerSchema>;