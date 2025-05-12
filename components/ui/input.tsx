import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'block w-full rounded-md border border-gray-300 px-3 py-2',
          'focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
          'placeholder:text-gray-400',
          className
        )}
        {...props}
      />
    );
  }
);
