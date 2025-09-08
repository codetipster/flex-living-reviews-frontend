// hooks/use-toast.ts - Modern replacement
import { toast as sonnerToast } from 'sonner'

// Create a wrapper that matches your existing API
export function useToast() {
  return {
    toast: ({
      title,
      description,
      variant = 'default',
      action,
      ...props
    }: {
      title?: string
      description?: string
      variant?: 'default' | 'destructive' | 'success'
      action?: React.ReactNode
      [key: string]: any
    }) => {
      switch (variant) {
        case 'destructive':
          return sonnerToast.error(title, {
            description,
            action,
            ...props
          })
        case 'success':
          return sonnerToast.success(title, {
            description,
            action,
            ...props
          })
        default:
          return sonnerToast(title, {
            description,
            action,
            ...props
          })
      }
    },
    dismiss: sonnerToast.dismiss
  }
}

// Export the toast function directly for convenience
export const toast = ({
  title,
  description,
  variant = 'default',
  action,
  ...props
}: {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  action?: React.ReactNode
  [key: string]: any
}) => {
  switch (variant) {
    case 'destructive':
      return sonnerToast.error(title, {
        description,
        action,
        ...props
      })
    case 'success':
      return sonnerToast.success(title, {
        description,
        action,
        ...props
      })
    default:
      return sonnerToast(title, {
        description,
        action,
        ...props
      })
  }
}