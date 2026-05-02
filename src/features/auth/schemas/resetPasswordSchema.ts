import { z } from "zod";
import { DEFAULT_PASSWORD_RULES } from "@/components/ui/field";

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    otp: z
      .string()
      .trim()
      .min(1, "OTP is required")
      .length(6, "OTP must be 6 digits"),

    newPassword: z
      .string()
      .min(1, "Password is required")
      .refine(
        (val) => DEFAULT_PASSWORD_RULES.every((rule) => rule.test(val)),
        {
          message: "Please meet all password requirements",
        }
      ),

    newPasswordConfirmation: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Passwords do not match",
    path: ["newPasswordConfirmation"],
  });

export type ResetPasswordCredentials = z.infer<typeof resetPasswordSchema>;
