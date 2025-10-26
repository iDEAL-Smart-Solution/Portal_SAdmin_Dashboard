import * as React from "react"
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
          variant === "default" && "bg-primary-500 text-white hover:bg-primary-600 shadow-soft hover:shadow-primary focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          variant === "destructive" && "bg-accent-500 text-white hover:bg-accent-600 shadow-soft hover:shadow-accent focus:ring-2 focus:ring-accent-500 focus:ring-offset-2",
          variant === "outline" && "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          variant === "ghost" && "text-primary-500 hover:bg-primary-50 hover:text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          variant === "link" && "text-primary-500 underline-offset-4 hover:underline hover:text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 px-3 text-xs",
          size === "lg" && "h-11 px-8 text-base",
          size === "icon" && "h-10 w-10",
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
