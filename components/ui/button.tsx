import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-colors',
          variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
          variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
          variant === 'outline' && 'border border-gray-300 hover:bg-gray-50',
          className
        )}
        {...props}
      />
    );
  }
);
