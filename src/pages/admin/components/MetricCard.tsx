import { type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: ReactNode;
  className?: string;
}

export function MetricCard({ title, value, change, icon, className }: MetricCardProps) {
  const isPositive = change && change.value > 0;
  const isNegative = change && change.value < 0;

  return (
    <Card className={cn("brand-card animate-fade-up hover:shadow-brand-elevated", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-brand-green-400 animate-icon-glow">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className={cn(
            "flex items-center text-xs mt-1",
            isPositive && "text-brand-green-500",
            isNegative && "text-brand-red-500",
            !isPositive && !isNegative && "text-muted-foreground"
          )}>
            {isPositive && <TrendingUp className="h-3 w-3 mr-1" />}
            {isNegative && <TrendingDown className="h-3 w-3 mr-1" />}
            <span>
              {isPositive && "+"}
              {change.value}% from {change.period}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}