"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Box, Typography, Divider } from "@mui/material";
import { useVerifyOtp, useResendOtp, useLogout } from "../hooks/useAuth";
import { UiPinInput } from "@/components/ui/pin-input/UiPinInput";
import { UiButton } from "@/components/ui/button/UiButton";
import { UiFieldError } from "@/components/ui/field";
import { EmailOutlined, LogoutOutlined, RefreshOutlined } from "@mui/icons-material";
import { maskEmail } from "@/lib/utils";

const RESEND_OTP_TIMEOUT = 60; // seconds

interface OtpVerificationFormProps {
  onSuccess?: () => void;
}


export function OtpVerificationForm({ onSuccess }: OtpVerificationFormProps) {
  const searchParams = useSearchParams();
//   const email = searchParams.get("email") || "";
  const email = 'kelechioleh@gmail.com'

  const [otp, setOtp] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(RESEND_OTP_TIMEOUT);
  const [error, setError] = useState<string | null>(null);

  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();
  const logoutMutation = useLogout();

  const isLoading = verifyMutation.isPending;
  const isResending = resendMutation.isPending;

  useEffect(() => {
    if (timeRemaining <= 0) return;
    const timer = setTimeout(() => setTimeRemaining((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeRemaining]);

  const handleResendOtp = async () => {
    if (!email || isResending) return;
    try {
      await resendMutation.mutateAsync(email);
      setTimeRemaining(RESEND_OTP_TIMEOUT);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    }
  };

  const handleVerify = async (value: string = otp) => {
    if (!email || value.length !== 6 || isLoading) return;
    try {
      await verifyMutation.mutateAsync({ email, otp: value });
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Invalid security code. Please try again.");
      setOtp("");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Box className="w-full max-w-md mx-auto">
      <Box className="flex items-center justify-center mb-10">
        <Box className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
          <EmailOutlined className="text-blue-500" sx={{ fontSize: 18 }} />
          <Typography variant="body2" className="font-semibold text-blue-700 truncate max-w-[200px]">
            {maskEmail(email)}
          </Typography>
        </Box>
      </Box>

      <Box className="space-y-8">
        <Box className="flex flex-col items-center">
          <UiPinInput
            length={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              if (error) setError(null);
              if (value.length === 6) handleVerify(value);
            }}
            disabled={isLoading}
            error={!!error}
          />
          
          {error && (
            <Box className="mt-4 animate-in fade-in slide-in-from-top-1">
              <UiFieldError className="text-center font-medium">
                {error}
              </UiFieldError>
            </Box>
          )}
        </Box>

        <UiButton
          fullWidth
          size="lg"
          onClick={() => handleVerify()}
          disabled={otp.length !== 6 || isLoading}
          className="shadow-md hover:shadow-lg transition-all"
        >
          {isLoading ? "Verifying..." : "Verify Identity"}
        </UiButton>
      </Box>

      <Box className="mt-10 space-y-6">
        <Box className="flex flex-col items-center gap-3">
          {timeRemaining > 0 ? (
            <Typography variant="caption" className="text-gray-400 uppercase tracking-widest font-bold">
              Resend available in <span className="text-gray-700">{formatTime(timeRemaining)}</span>
            </Typography>
          ) : (
            <UiButton
              variant="ghost"
              size="sm"
              onClick={handleResendOtp}
              disabled={isResending}
              startIcon={<RefreshOutlined sx={{ fontSize: 18 }} />}
              className="text-blue-600 hover:bg-blue-50"
            >
              {isResending ? "Sending New Code..." : "Resend Security Code"}
            </UiButton>
          )}
        </Box>

        <Divider className="opacity-60">
          <Typography variant="caption" className="text-gray-400 px-2 uppercase tracking-tighter">
            Account Options
          </Typography>
        </Divider>

        <Box className="flex flex-col gap-3">
          <UiButton
            variant="ghost"
            fullWidth
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            startIcon={<LogoutOutlined sx={{ fontSize: 18 }} />}
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Sign Out
          </UiButton>

          <Link
            href="/auth/login"
            className="block text-center text-xs text-gray-500 hover:text-blue-600 hover:underline transition-colors"
          >
            Not your email? Back to Login
          </Link>
        </Box>
      </Box>
    </Box>
  );
}