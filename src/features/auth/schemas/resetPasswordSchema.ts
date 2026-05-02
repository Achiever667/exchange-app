import { z } from "zod";
import { DEFAULT_PASSWORD_RULES } from "@/components/ui/field";

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resetPasswordFormSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

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

export type ResetPasswordCredentials = z.infer<typeof resetPasswordFormSchema>;