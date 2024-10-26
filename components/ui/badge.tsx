import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        success:
          "border-transparent bg-badge-success text-badge-success-foreground hover:bg-badge-success/80",
        warning:
          "border-transparent bg-badge-warning text-badge-warning-foreground hover:bg-badge-warning/80",
        error:
          "border-transparent bg-badge-error text-badge-error-foreground hover:bg-badge-error/80",
        info:
          "border-transparent bg-badge-info text-badge-info-foreground hover:bg-badge-info/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };