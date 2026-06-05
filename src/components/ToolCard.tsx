import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, LucideIcon } from 'lucide-react';

export interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  gradient?: string;
  isNew?: boolean;
  isPro?: boolean;
  className?: string;
}

export function ToolCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
  badgeVariant = 'secondary',
  gradient = 'from-brand-500 to-purple-600',
  isNew = false,
  isPro = false,
  className,
}: ToolCardProps) {
  return (
    <Card
      className={cn(
        'tool-card group cursor-pointer border-border/50 bg-card hover:border-primary/30',
        className
      )}
    >
      <Link href={href} className="block h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            {/* Icon */}
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg',
                gradient,
                'group-hover:shadow-xl group-hover:scale-110 transition-all duration-300'
              )}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              {isNew && (
                <Badge
                  variant="default"
                  className="bg-gradient-brand text-white border-0 text-xs px-2 py-0.5"
                >
                  New
                </Badge>
              )}
              {isPro && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800 text-xs px-2 py-0.5"
                >
                  Pro
                </Badge>
              )}
              {badge && !isNew && !isPro && (
                <Badge variant={badgeVariant} className="text-xs px-2 py-0.5">
                  {badge}
                </Badge>
              )}
            </div>
          </div>

          <CardTitle className="mt-3 text-lg font-semibold group-hover:text-primary transition-colors duration-200">
            {title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between group-hover:bg-primary/5 transition-colors duration-200 rounded-xl"
            tabIndex={-1}
          >
            <span className="text-sm font-medium">Open tool</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
