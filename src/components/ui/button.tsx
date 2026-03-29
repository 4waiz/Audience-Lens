"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-[-0.01em] transition duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-foreground shadow-[0_14px_30px_rgba(124,77,255,0.2)] hover:bg-[#6d3ef4] hover:shadow-[0_18px_38px_rgba(124,77,255,0.24)]",
        secondary: "bg-muted text-foreground hover:bg-[#e7defb]",
        outline:
          "border border-[rgba(23,19,41,0.14)] bg-white/88 text-foreground hover:bg-white",
        ghost:
          "text-[rgba(23,19,41,0.76)] hover:bg-[rgba(124,77,255,0.1)] hover:text-foreground",
        live: "bg-live text-white hover:bg-[#5f47ef]",
        danger: "bg-danger text-white hover:bg-[#b53434]",
      },
      size: {
        default: "h-11 px-5.5",
        sm: "h-10 px-4 text-[13px]",
        lg: "h-13 px-6.5 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
