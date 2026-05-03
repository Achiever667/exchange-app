'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegister } from '../hooks/useAuth';
import {
  UiField,
  UiFieldError,
  UiFieldGroup,
  DEFAULT_PASSWORD_RULES,
} from '@/components/ui/field';
import { UiButton } from '@/components/ui/button/UiButton';
import { useToast } from '@/components/ui/toast';
import { STORAGE_KEYS, OTP_TYPES } from '@/constants';

import { Mail, Lock, Person, Phone, Language } from '@mui/icons-material';
import { registerSchema, RegisterCredentials } from '../schemas/registerSchema';

export function RegistrationForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const { addToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  
const onsubmit = async (data: RegisterCredentials) => {
    try {
      const payload = {
        ...data,
        otp_type: OTP_TYPES.REGISTRATION,
      };
      await registerMutation.mutateAsync(payload);
      
        localStorage.setItem(STORAGE_KEYS.OTP_TYPE, OTP_TYPES.REGISTRATION);
        localStorage.setItem(STORAGE_KEYS.OTP_EMAIL, data.email);
      
      addToast({
        type: 'success',
        message: 'Registration successful! Please verify your email.',
      });
      router.push('/auth/verify');
    } catch (error: any) {
      const message = error.message || 'Registration failed';
      addToast({ type: 'error', message });
      setError('root', {
        message,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onsubmit)}
      className="w-full max-w-2xl space-y-6"
    >
      <UiFieldGroup
        title="Personal Information"
        description="Please fill in your details"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Controller
            name="firstname"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="First Name"
                placeholder="John"
                disabled={isSubmitting }
                error={!!errors.firstname}
                errorMessage={errors.firstname?.message}
                startIcon={<Person sx={{ fontSize: 20 }} />}
              />
            )}
          />

          <Controller
            name="lastname"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="Last Name"
                placeholder="Doe"
                disabled={isSubmitting }
                error={!!errors.lastname}
                errorMessage={errors.lastname?.message}
                startIcon={<Person sx={{ fontSize: 20 }} />}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mt-4">
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="Username"
                placeholder="johndoe"
                disabled={isSubmitting }
                error={!!errors.username}
                errorMessage={errors.username?.message}
                startIcon={<Person sx={{ fontSize: 20 }} />}
              />
            )}
          />
        </div>
      </UiFieldGroup>

      <UiFieldGroup>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="Email"
                placeholder="you@example.com"
                type="email"
                disabled={isSubmitting }
                error={!!errors.email}
                errorMessage={errors.email?.message}
                startIcon={<Mail sx={{ fontSize: 20 }} />}
              />
            )}
          />

          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="Phone Number"
                placeholder="08059811404"
                type="number"
                disabled={isSubmitting }
                error={!!errors.phone_number}
                errorMessage={errors.phone_number?.message}
                startIcon={<Phone sx={{ fontSize: 20 }} />}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Controller
            name="dial_code"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="Dial Code"
                placeholder="+234"
                disabled={isSubmitting }
                error={!!errors.dial_code}
                errorMessage={errors.dial_code?.message}
startIcon={<Language sx={{ fontSize: 20 }} />}
              />
            )}
          />

          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="Country"
                placeholder="Nigeria"
                disabled={isSubmitting }
                error={!!errors.country}
                errorMessage={errors.country?.message}
                startIcon={<Language sx={{ fontSize: 20 }} />}
              />
            )}
          />
        </div>
      </UiFieldGroup>

      <UiFieldGroup>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="Password"
                placeholder="••••••••"
                type="password"
                disabled={isSubmitting}
                showPasswordToggle
                validationRules={DEFAULT_PASSWORD_RULES}
                error={!!errors.password}
                errorMessage={errors.password?.message}
                startIcon={<Lock sx={{ fontSize: 20 }} />}
              />
            )}
          />

          <Controller
            name="password_confirmation"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="Confirm Password"
                placeholder="••••••••"
                type="password"
                disabled={isSubmitting }
                showPasswordToggle
                error={!!errors.password_confirmation}
                errorMessage={errors.password_confirmation?.message}
                startIcon={<Lock sx={{ fontSize: 20 }} />}
              />
            )}
          />
        </div>
      </UiFieldGroup>

      {errors.root && (
        <UiFieldError className="justify-center hidden">
          {errors.root.message}
        </UiFieldError>
      )}

      <UiButton type="submit" disabled={isSubmitting  || !isValid} fullWidth>
        {isSubmitting  ? 'Creating account...' : 'Create Account'}
      </UiButton>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="text-blue-600 hover:underline font-medium"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
