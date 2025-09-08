import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useMemo } from 'react';
import { reviewsService } from '@/services/api/reviews.service';
import { useReviewsStore, useReviewsActions } from '@/store/reviews.store';
import { CACHE_TTL } from '@/constants/api';
import type { ReviewFilters, Pagination, ApprovalRequest } from '@/types/api';

// Query keys for React Query
export const QUERY_KEYS = {
  DASHBOARD: 'dashboard',
  PUBLIC_REVIEWS: 'public-reviews',
  HOSTAWAY_REVIEWS: 'hostaway-reviews',
} as const;

// Custom hook for dashboard data
export const useDashboard = (filters: Partial<ReviewFilters> = {}, pagination: Partial<Pagination> = {}) => {
  const actions = useReviewsActions();
  
  const query = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, filters, pagination],
    queryFn: () => reviewsService.getDashboard(filters, pagination),
    staleTime: CACHE_TTL.DASHBOARD,
    gcTime: CACHE_TTL.DASHBOARD * 2,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Handle success/error with useEffect
  React.useEffect(() => {
    if (query.data) {
      actions.setDashboardData(query.data);
    }
    if (query.error) {
      actions.setDashboardError(query.error.message);
    }
  }, [query.data, query.error, actions]);

  return query;
};

// Custom hook for public reviews
export const usePublicReviews = (propertyName: string, pagination: Partial<Pagination> = {}) => {
  const actions = useReviewsActions();
  
  const query = useQuery({
    queryKey: [QUERY_KEYS.PUBLIC_REVIEWS, propertyName, pagination],
    queryFn: () => reviewsService.getPublicReviews(propertyName, pagination),
    enabled: !!propertyName,
    staleTime: CACHE_TTL.PUBLIC_REVIEWS,
    gcTime: CACHE_TTL.PUBLIC_REVIEWS * 2,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Handle success/error with useEffect
  React.useEffect(() => {
    if (query.data) {
      actions.setPublicReviewsData(propertyName, query.data);
    }
    if (query.error) {
      actions.setPublicReviewsError(propertyName, query.error.message);
    }
  }, [query.data, query.error, propertyName, actions]);

  return query;
};

// Custom hook for review approval
export const useReviewApproval = () => {
  const queryClient = useQueryClient();
  const actions = useReviewsActions();
  
  const approveMutation = useMutation({
    mutationFn: (reviewId: string) => reviewsService.approveReview(reviewId),
    onSuccess: (data, reviewId) => {
      // Update local state
      actions.updateReviewApproval(reviewId, true);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PUBLIC_REVIEWS] });
    },
    onError: (error: Error) => {
      console.error('Failed to approve review:', error);
    },
  });
  
  const removeApprovalMutation = useMutation({
    mutationFn: (reviewId: string) => reviewsService.removeApproval(reviewId),
    onSuccess: (data, reviewId) => {
      // Update local state
      actions.updateReviewApproval(reviewId, false);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PUBLIC_REVIEWS] });
    },
    onError: (error: Error) => {
      console.error('Failed to remove approval:', error);
    },
  });
  
  const toggleApproval = useCallback(async (reviewId: string, isApproved: boolean) => {
    try {
      if (isApproved) {
        await approveMutation.mutateAsync(reviewId);
      } else {
        await removeApprovalMutation.mutateAsync(reviewId);
      }
    } catch (error) {
      // Error handling is done in the mutation onError
      throw error;
    }
  }, [approveMutation, removeApprovalMutation]);
  
  return {
    toggleApproval,
    isApproving: approveMutation.isPending,
    isRemovingApproval: removeApprovalMutation.isPending,
    isPending: approveMutation.isPending || removeApprovalMutation.isPending,
    error: approveMutation.error || removeApprovalMutation.error,
  };
};

// Custom hook for syncing reviews
export const useSyncReviews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => reviewsService.syncReviews(),
    onSuccess: () => {
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      console.error('Failed to sync reviews:', error);
    },
  });
};

// Custom hook for filtered and sorted reviews
export const useFilteredReviews = () => {
  const { data: dashboardData } = useDashboard();
  const { ui, filters } = useReviewsStore();
  
  return useMemo(() => {
    if (!dashboardData?.reviews) return [];
    
    let filteredReviews = [...dashboardData.reviews];
    
    // Apply search filter
    if (ui.searchTerm) {
      const searchLower = ui.searchTerm.toLowerCase();
      filteredReviews = filteredReviews.filter(review =>
        review.guestName.toLowerCase().includes(searchLower) ||
        review.propertyName.toLowerCase().includes(searchLower) ||
        review.reviewText.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply property filter
    if (ui.selectedProperty !== 'all') {
      filteredReviews = filteredReviews.filter(review =>
        review.propertyName === ui.selectedProperty
      );
    }
    
    // Apply rating filter
    if (filters.minRating !== undefined) {
      filteredReviews = filteredReviews.filter(review =>
        review.overallRating >= filters.minRating!
      );
    }
    
    // Apply channel filter
    if (filters.channel) {
      filteredReviews = filteredReviews.filter(review =>
        review.channel === filters.channel
      );
    }
    
    // Apply approval filter
    if (filters.isApprovedForPublic !== undefined) {
      filteredReviews = filteredReviews.filter(review =>
        review.isApprovedForPublic === filters.isApprovedForPublic
      );
    }
    
    // Apply sorting
    filteredReviews.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (ui.sortBy) {
        case 'rating':
          aValue = a.overallRating;
          bValue = b.overallRating;
          break;
        case 'date':
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
          break;
        case 'guest':
          aValue = a.guestName.toLowerCase();
          bValue = b.guestName.toLowerCase();
          break;
        case 'property':
          aValue = a.propertyName.toLowerCase();
          bValue = b.propertyName.toLowerCase();
          break;
        default:
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
      }
      
      if (ui.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filteredReviews;
  }, [dashboardData?.reviews, ui, filters]);
};

// Custom hook for review statistics
export const useReviewStats = () => {
  const { data: dashboardData } = useDashboard();
  
  return useMemo(() => {
    if (!dashboardData?.reviews) {
      return {
        totalReviews: 0,
        approvedReviews: 0,
        pendingReviews: 0,
        averageRating: 0,
        ratingDistribution: {
          excellent: 0,
          good: 0,
          average: 0,
          poor: 0,
        },
      };
    }
    
    const reviews = dashboardData.reviews;
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter(r => r.isApprovedForPublic).length;
    const pendingReviews = totalReviews - approvedReviews;
    const averageRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews;
    
    const ratingDistribution = reviews.reduce(
      (acc, review) => {
        if (review.overallRating >= 4.5) acc.excellent++;
        else if (review.overallRating >= 3.5) acc.good++;
        else if (review.overallRating >= 2.5) acc.average++;
        else acc.poor++;
        return acc;
      },
      { excellent: 0, good: 0, average: 0, poor: 0 }
    );
    
    return {
      totalReviews,
      approvedReviews,
      pendingReviews,
      averageRating: Number(averageRating.toFixed(1)),
      ratingDistribution,
    };
  }, [dashboardData?.reviews]);
};
