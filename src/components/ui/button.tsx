import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          "group relative z-10 flex w-fit cursor-pointer items-center overflow-hidden rounded-full bg-violet-50 px-7 py-3",
          className,
        )}
      >
        <span className="relative inline-flex overflow-hidden font-general text-xs font-medium uppercase text-black">
          <div className="flex translate-y-0 skew-y-0 items-center justify-center gap-2 opacity-100 transition-all duration-300 ease-in-out group-hover:translate-y-[-160%] group-hover:skew-y-12 group-hover:opacity-0">
            {leftIcon}
            {children}
            {rightIcon}
          </div>
          <div className="absolute flex translate-y-[164%] skew-y-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:skew-y-0 group-hover:opacity-100">
            {leftIcon}
            {children}
            {rightIcon}
          </div>
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
