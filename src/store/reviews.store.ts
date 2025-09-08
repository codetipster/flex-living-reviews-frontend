import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  ReviewEntity,
  ReviewFilters,
  Pagination,
  PropertyAnalytics,
  DashboardResponse,
  PublicReviewsResponse,
} from '@/types/api';

// Review Store State Interface
interface ReviewsState {

  dashboard: {
    data: DashboardResponse | null;
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
  };
  
  // Public reviews state
  publicReviews: Record<string, {
    data: PublicReviewsResponse | null;
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
  }>;
  
  // Filters and pagination
  filters: ReviewFilters;
  pagination: Pagination;
  
  // UI state
  ui: {
    selectedProperty: string;
    searchTerm: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    viewMode: 'table' | 'grid';
  };
  
  // Actions
  actions: {
    // Dashboard actions
    setDashboardLoading: (loading: boolean) => void;
    setDashboardData: (data: DashboardResponse) => void;
    setDashboardError: (error: string | null) => void;
    
    // Public reviews actions
    setPublicReviewsLoading: (propertyName: string, loading: boolean) => void;
    setPublicReviewsData: (propertyName: string, data: PublicReviewsResponse) => void;
    setPublicReviewsError: (propertyName: string, error: string | null) => void;
    
    // Filter actions
    setFilters: (filters: Partial<ReviewFilters>) => void;
    resetFilters: () => void;
    
    // Pagination actions
    setPagination: (pagination: Partial<Pagination>) => void;
    resetPagination: () => void;
    
    // UI actions
    setSelectedProperty: (property: string) => void;
    setSearchTerm: (term: string) => void;
    setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    setViewMode: (mode: 'table' | 'grid') => void;
    
    // Review actions
    updateReviewApproval: (reviewId: string, isApproved: boolean) => void;
    
    // Utility actions
    clearCache: () => void;
    clearError: (type: 'dashboard' | 'publicReviews', propertyName?: string) => void;
  };
}

// Initial state
const initialState = {
  dashboard: {
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  },
  publicReviews: {},
  filters: {},
  pagination: {
    limit: 50,
    offset: 0,
    sortBy: 'date',
    sortOrder: 'desc' as const,
  },
  ui: {
    selectedProperty: 'all',
    searchTerm: '',
    sortBy: 'date',
    sortOrder: 'desc' as const,
    viewMode: 'table' as const,
  },
};

// Create the store
export const useReviewsStore = create<ReviewsState>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,
        
        actions: {
          // Dashboard actions
          setDashboardLoading: (loading: boolean) =>
            set((state) => {
              state.dashboard.loading = loading;
              if (loading) {
                state.dashboard.error = null;
              }
            }),
          
          setDashboardData: (data: DashboardResponse) =>
            set((state) => {
              state.dashboard.data = data;
              state.dashboard.loading = false;
              state.dashboard.error = null;
              state.dashboard.lastFetched = Date.now();
            }),
          
          setDashboardError: (error: string | null) =>
            set((state) => {
              state.dashboard.error = error;
              state.dashboard.loading = false;
            }),
          
          // Public reviews actions
          setPublicReviewsLoading: (propertyName: string, loading: boolean) =>
            set((state) => {
              if (!state.publicReviews[propertyName]) {
                state.publicReviews[propertyName] = {
                  data: null,
                  loading: false,
                  error: null,
                  lastFetched: null,
                };
              }
              state.publicReviews[propertyName].loading = loading;
              if (loading) {
                state.publicReviews[propertyName].error = null;
              }
            }),
          
          setPublicReviewsData: (propertyName: string, data: PublicReviewsResponse) =>
            set((state) => {
              if (!state.publicReviews[propertyName]) {
                state.publicReviews[propertyName] = {
                  data: null,
                  loading: false,
                  error: null,
                  lastFetched: null,
                };
              }
              state.publicReviews[propertyName].data = data;
              state.publicReviews[propertyName].loading = false;
              state.publicReviews[propertyName].error = null;
              state.publicReviews[propertyName].lastFetched = Date.now();
            }),
          
          setPublicReviewsError: (propertyName: string, error: string | null) =>
            set((state) => {
              if (!state.publicReviews[propertyName]) {
                state.publicReviews[propertyName] = {
                  data: null,
                  loading: false,
                  error: null,
                  lastFetched: null,
                };
              }
              state.publicReviews[propertyName].error = error;
              state.publicReviews[propertyName].loading = false;
            }),
          
          // Filter actions
          setFilters: (filters: Partial<ReviewFilters>) =>
            set((state) => {
              state.filters = { ...state.filters, ...filters };
            }),
          
          resetFilters: () =>
            set((state) => {
              state.filters = {};
            }),
          
          // Pagination actions
          setPagination: (pagination: Partial<Pagination>) =>
            set((state) => {
              state.pagination = { ...state.pagination, ...pagination };
            }),
          
          resetPagination: () =>
            set((state) => {
              state.pagination = {
                limit: 50,
                offset: 0,
                sortBy: 'date',
                sortOrder: 'desc' as const,
              };
            }),
          
          // UI actions
          setSelectedProperty: (property: string) =>
            set((state) => {
              state.ui.selectedProperty = property;
            }),
          
          setSearchTerm: (term: string) =>
            set((state) => {
              state.ui.searchTerm = term;
            }),
          
          setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') =>
            set((state) => {
              state.ui.sortBy = sortBy;
              state.ui.sortOrder = sortOrder;
              state.pagination.sortBy = sortBy;
              state.pagination.sortOrder = sortOrder;
            }),
          
          setViewMode: (mode: 'table' | 'grid') =>
            set((state) => {
              state.ui.viewMode = mode;
            }),
          
          // Review actions
          updateReviewApproval: (reviewId: string, isApproved: boolean) =>
            set((state) => {
              // Update dashboard data
              if (state.dashboard.data) {
                const review = state.dashboard.data.reviews.find(r => r.id === reviewId);
                if (review) {
                  review.isApprovedForPublic = isApproved;
                }
              }
              
              // Update public reviews data for all properties
              Object.values(state.publicReviews).forEach(propertyData => {
                if (propertyData.data) {
                  const review = propertyData.data.reviews.find(r => r.id === reviewId);
                  if (review) {
                    review.isApprovedForPublic = isApproved;
                  }
                }
              });
            }),
          
          // Utility actions
          clearCache: () =>
            set((state) => {
              state.dashboard.data = null;
              state.dashboard.lastFetched = null;
              state.publicReviews = {};
            }),
          
          clearError: (type: 'dashboard' | 'publicReviews', propertyName?: string) =>
            set((state) => {
              if (type === 'dashboard') {
                state.dashboard.error = null;
              } else if (type === 'publicReviews' && propertyName) {
                if (state.publicReviews[propertyName]) {
                  state.publicReviews[propertyName].error = null;
                }
              }
            }),
        },
      }))
    ),
    {
      name: 'reviews-store',
    }
  )
);

// Selectors for better performance
export const useDashboardData = () => useReviewsStore((state) => state.dashboard);
export const usePublicReviewsData = (propertyName: string) => 
  useReviewsStore((state) => state.publicReviews[propertyName] || {
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });
export const useFilters = () => useReviewsStore((state) => state.filters);
export const usePagination = () => useReviewsStore((state) => state.pagination);
export const useUIState = () => useReviewsStore((state) => state.ui);
export const useReviewsActions = () => useReviewsStore((state) => state.actions);
