/**
 * Auth Components - UI components for authentication
 * Organized by feature for easy scalability
 * 
 * SOLID: Single Responsibility - Each component has one purpose
 * No API calls directly in components
 */

'use client';

import { useState, FormEvent } from 'react';
import { useLogin } from '../hooks/useAuth';
import { AuthCredentials } from '@/types';

/**
 * LoginForm Component
 * Handles user login with email and password
 * 
 * Props:
 * - onSuccess: Callback after successful login
 * - isLoading: Controlled loading state (optional)
 */
interface LoginFormProps {
  onSuccess?: () => void;
  isLoading?: boolean;
}

export function LoginForm({ onSuccess, isLoading: externalLoading }: LoginFormProps) {
  const [formData, setFormData] = useState<AuthCredentials>({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const loginMutation = useLogin();
  const isLoading = externalLoading ?? loginMutation.isLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (!formData.email || !formData.password) {
      setLocalError('Email and password are required');
      return;
    }

    try {
      await loginMutation.mutateAsync(formData);
      onSuccess?.();
    } catch (error: any) {
      setLocalError(error.message || 'Login failed');
    }
  };

  const errorMessage = localError || loginMutation.error?.message;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
