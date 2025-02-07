import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "flex-center group relative w-fit shrink-0 cursor-pointer overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "text-accent-foreground bg-accent",
        secondary: "text-secondary-foreground bg-secondary",
      },
      size: {
        default: "px-7 py-3",
        small: "px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(buttonVariants({ variant, size, className }), "group")}
      >
        <span className="relative inline-flex overflow-hidden font-general text-xs font-medium uppercase">
          <div className="flex-center translate-y-0 skew-y-0 gap-2 opacity-100 transition-all duration-300 ease-in-out group-hover:translate-y-[-160%] group-hover:skew-y-12 group-hover:opacity-0">
            {children}
          </div>
          <div className="flex-center absolute translate-y-[160%] skew-y-12 gap-2 opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:skew-y-0 group-hover:opacity-100">
            {children}
          </div>
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
