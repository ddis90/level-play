import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/15 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        success: 'bg-emerald-100 text-emerald-700',
        progress: 'bg-orange-100 text-orange-700',
        design: 'bg-indigo-100 text-indigo-600',
        internal: 'bg-indigo-100 text-indigo-600',
        admin: 'bg-red-100 text-red-600',
        client: 'bg-emerald-100 text-emerald-700',
        outline: 'border border-border text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
