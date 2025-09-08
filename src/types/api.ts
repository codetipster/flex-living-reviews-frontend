import { z } from 'zod';

// Base API Response Schema
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.object({
    message: z.string(),
    code: z.string(),
    context: z.any().optional(),
  }).optional(),
  timestamp: z.string(),
  requestId: z.string().optional(),
});

// Review Category Schema
export const ReviewCategoriesSchema = z.object({
  cleanliness: z.number().min(0).max(5),
  communication: z.number().min(0).max(5),
  respect_house_rules: z.number().min(0).max(5),
});

// Review Entity Schema
export const ReviewEntitySchema = z.object({
  id: z.string(),
  externalId: z.string(),
  propertyName: z.string(),
  guestName: z.string(),
  reviewText: z.string(),
  overallRating: z.number().min(0).max(5),
  categories: ReviewCategoriesSchema,
  submittedAt: z.string().transform((str) => new Date(str)),
  channel: z.enum(['hostaway', 'google', 'airbnb']),
  status: z.enum(['published', 'pending', 'hidden']),
  type: z.enum(['host-to-guest', 'guest-to-host']),
  isApprovedForPublic: z.boolean(),
  approvedAt: z.string().transform((str) => new Date(str)).optional(),
  approvedBy: z.string().optional(),
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
});

// Property Analytics Schema
export const PropertyAnalyticsSchema = z.object({
  averageRating: z.number(),
  totalReviews: z.number(),
  approvedReviews: z.number(),
  ratingDistribution: z.object({
    '9-10': z.number(),
    '7-8': z.number(),
    '5-6': z.number(),
    '1-4': z.number(),
  }),
  categoryAverages: ReviewCategoriesSchema,
});

// Dashboard Response Schema
export const DashboardResponseSchema = z.object({
  reviews: z.array(ReviewEntitySchema),
  analytics: PropertyAnalyticsSchema,
  pagination: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    hasMore: z.boolean(),
  }),
  filters: z.any(),
});

// Public Reviews Response Schema
export const PublicReviewsResponseSchema = z.object({
  property: z.object({
    name: z.string(),
    averageRating: z.number(),
    totalApprovedReviews: z.number(),
  }),
  reviews: z.array(ReviewEntitySchema),
  pagination: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    hasMore: z.boolean(),
  }),
});

// Review Filters Schema
export const ReviewFiltersSchema = z.object({
  propertyName: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
  category: z.enum(['cleanliness', 'communication', 'respect_house_rules']).optional(),
  channel: z.enum(['hostaway', 'google', 'airbnb']).optional(),
  timeFrom: z.string().optional(),
  timeTo: z.string().optional(),
  isApprovedForPublic: z.boolean().optional(),
});

// Pagination Schema
export const PaginationSchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
  sortBy: z.string().default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Approval Request Schema
export const ApprovalRequestSchema = z.object({
  reviewId: z.string(),
});

// Sync Response Schema
export const SyncResponseSchema = z.object({
  synced: z.number(),
  errors: z.array(z.string()),
  sources: z.array(z.string()),
});

// Type exports
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & { data?: T };
export type ReviewEntity = z.infer<typeof ReviewEntitySchema>;
export type ReviewCategories = z.infer<typeof ReviewCategoriesSchema>;
export type PropertyAnalytics = z.infer<typeof PropertyAnalyticsSchema>;
export type DashboardResponse = z.infer<typeof DashboardResponseSchema>;
export type PublicReviewsResponse = z.infer<typeof PublicReviewsResponseSchema>;
export type ReviewFilters = z.infer<typeof ReviewFiltersSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type ApprovalRequest = z.infer<typeof ApprovalRequestSchema>;
export type SyncResponse = z.infer<typeof SyncResponseSchema>;

// API Error types
export interface ApiError {
  message: string;
  code: string;
  context?: any;
}

export interface NetworkError {
  message: string;
  status?: number;
  statusText?: string;
}
