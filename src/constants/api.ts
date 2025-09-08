// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',
  
  // Reviews
  REVIEWS: {
    HOSTAWAY: '/api/reviews/hostaway',
    SYNC: '/api/reviews/sync',
  },
  
  // Manager
  MANAGER: {
    DASHBOARD: '/api/manager/dashboard',
    APPROVE_REVIEW: '/api/manager/approve-review',
    REMOVE_APPROVAL: '/api/manager/approve-review',
  },
  
  // Public
  PUBLIC: {
    REVIEWS: (propertyName: string) => `/api/public/reviews/${encodeURIComponent(propertyName)}`,
  },
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// Request Headers
export const REQUEST_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  X_REQUEST_ID: 'X-Request-ID',
  X_USER_ID: 'X-User-ID',
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const;

// Error Codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  REVIEW_NOT_FOUND: 'REVIEW_NOT_FOUND',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;

// Cache Keys
export const CACHE_KEYS = {
  DASHBOARD: 'dashboard',
  REVIEWS: 'reviews',
  PUBLIC_REVIEWS: (propertyName: string) => `public-reviews-${propertyName}`,
  PROPERTY_ANALYTICS: (propertyName: string) => `property-analytics-${propertyName}`,
} as const;

// Cache TTL (Time To Live) in milliseconds
export const CACHE_TTL = {
  DASHBOARD: 5 * 60 * 1000, // 5 minutes
  REVIEWS: 5 * 60 * 1000, // 5 minutes
  PUBLIC_REVIEWS: 10 * 60 * 1000, // 10 minutes
  PROPERTY_ANALYTICS: 15 * 60 * 1000, // 15 minutes
} as const;

// Pagination Defaults
export const PAGINATION_DEFAULTS = {
  LIMIT: 50,
  MAX_LIMIT: 100,
  OFFSET: 0,
  SORT_BY: 'date',
  SORT_ORDER: 'desc' as const,
} as const;

// Review Channels
export const REVIEW_CHANNELS = {
  HOSTAWAY: 'hostaway',
  GOOGLE: 'google',
  AIRBNB: 'airbnb',
} as const;

// Review Categories
export const REVIEW_CATEGORIES = {
  CLEANLINESS: 'cleanliness',
  COMMUNICATION: 'communication',
  RESPECT_HOUSE_RULES: 'respect_house_rules',
} as const;

// Review Status
export const REVIEW_STATUS = {
  PUBLISHED: 'published',
  PENDING: 'pending',
  HIDDEN: 'hidden',
} as const;

// Review Types
export const REVIEW_TYPES = {
  HOST_TO_GUEST: 'host-to-guest',
  GUEST_TO_HOST: 'guest-to-host',
} as const;

// Rating Ranges
export const RATING_RANGES = {
  EXCELLENT: { min: 4.5, max: 5.0, label: 'Excellent' },
  GOOD: { min: 3.5, max: 4.4, label: 'Good' },
  AVERAGE: { min: 2.5, max: 3.4, label: 'Average' },
  POOR: { min: 1.0, max: 2.4, label: 'Poor' },
} as const;

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  LOADING_SKELETON_COUNT: 6,
  INFINITE_SCROLL_THRESHOLD: 100,
} as const;
