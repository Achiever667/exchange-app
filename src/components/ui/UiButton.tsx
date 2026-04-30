
import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizeStyles = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClass = variantStyles[variant];
  const sizeClass = sizeStyles[size];
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
