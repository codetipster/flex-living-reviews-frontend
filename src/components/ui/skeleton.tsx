import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Review Card Skeleton
export function ReviewCardSkeleton() {
  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-12" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}

// Dashboard Metric Skeleton
export function MetricCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

// Table Row Skeleton
export function TableRowSkeleton() {
  return (
    <tr className="border-b">
      <td className="p-4">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-12" />
        </div>
      </td>
      <td className="p-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
      </td>
      <td className="p-4">
        <Skeleton className="h-6 w-16" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="p-4">
        <Skeleton className="h-6 w-12" />
      </td>
    </tr>
  )
}

// Property Card Skeleton
export function PropertyCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}

// Chart Skeleton
export function ChartSkeleton() {
  return (
    <div className="p-6 border rounded-lg">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-2 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Loading Spinner
export function LoadingSpinner({ size = "default", className }: { size?: "sm" | "default" | "lg", className?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-brand-green-400", sizeClasses[size], className)} />
  )
}

// Loading Overlay
export function LoadingOverlay({ isLoading, children }: { isLoading: boolean, children: React.ReactNode }) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export { Skeleton }
