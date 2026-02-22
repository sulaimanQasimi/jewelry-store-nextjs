'use client'

import { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'gold'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  children: React.ReactNode
  className?: string
  asChild?: false
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#2C2C2C] text-cream-50 border border-[#2C2C2C] hover:bg-[#1a1a1a] hover:border-[#1a1a1a] shadow-md hover:shadow-lg',
  gold:
    'bg-[#D4AF37] text-[#2C2C2C] border border-[#D4AF37] hover:bg-[#c4a030] hover:border-[#c4a030] shadow-md hover:shadow-lg',
  outline:
    'bg-transparent text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-cream-50',
  ghost:
    'bg-transparent text-[#2C2C2C] border border-transparent hover:bg-cream-200/50',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-2.5 text-sm gap-2',
  lg: 'px-8 py-3 text-base gap-2.5',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={`
          store-btn inline-flex items-center justify-center font-medium
          rounded-sm transition-all duration-300 ease-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" aria-hidden />}
        {children}
        {RightIcon && <RightIcon className="w-4 h-4 shrink-0" aria-hidden />}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
