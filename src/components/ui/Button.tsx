import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "default",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
        variant === "primary" && "bg-primary text-white hover:bg-primary/90",
        variant === "secondary" && "bg-secondary/20 text-gray-900 hover:bg-secondary/30",
        variant === "ghost" && "text-gray-700 hover:bg-gray-100",
        size === "sm" && "h-8 px-3 text-sm",
        size === "default" && "h-10 px-4 py-2",
        size === "lg" && "h-12 px-6 text-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}