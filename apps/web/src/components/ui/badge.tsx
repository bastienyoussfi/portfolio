import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[var(--sep)] bg-[var(--card)] text-[var(--text-2)] shadow-[var(--shadow-tag)]",
        secondary:
          "border-transparent bg-[var(--fill-1)] text-[var(--text-2)]",
        destructive:
          "border-transparent bg-[var(--red)] text-white",
        outline: "border-[var(--sep)] text-[var(--text-2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
