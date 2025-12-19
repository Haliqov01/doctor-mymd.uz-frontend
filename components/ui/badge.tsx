import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-teal-200 bg-teal-50 text-teal-700",
        secondary:
          "border-slate-200 bg-slate-50 text-slate-600",
        destructive:
          "border-red-200 bg-red-50 text-red-700",
        outline: 
          "border-slate-200 text-slate-700",
        // Status variants - mymd.uz uyumlu
        pending:
          "border-amber-200 bg-amber-50 text-amber-700",
        confirmed:
          "border-teal-200 bg-teal-50 text-teal-700",
        completed:
          "border-blue-200 bg-blue-50 text-blue-700",
        rejected:
          "border-red-200 bg-red-50 text-red-700",
        cancelled:
          "border-slate-200 bg-slate-50 text-slate-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
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


