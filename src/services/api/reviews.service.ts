import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  DashboardResponse,
  PublicReviewsResponse,
  ReviewFilters,
  Pagination,
  // ApprovalRequest,
  SyncResponse,
  ReviewEntity,
} from '@/types/api';

// Reviews API Service
export class ReviewsService {
  // Get dashboard data with filters and pagination
  async getDashboard(
    filters: Partial<ReviewFilters> = {},
    pagination: Partial<Pagination> = {}
  ): Promise<DashboardResponse> {
    const params = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    // Add pagination to query params
    Object.entries(pagination).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.MANAGER.DASHBOARD}?${queryString}`
      : API_ENDPOINTS.MANAGER.DASHBOARD;
    
    const response = await apiClient.get<DashboardResponse>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to fetch dashboard data');
    }
    
    return response.data;
  }

  // Get public reviews for a property
  async getPublicReviews(
    propertyName: string,
    pagination: Partial<Pagination> = {}
  ): Promise<PublicReviewsResponse> {
    const params = new URLSearchParams();
    
    // Add pagination to query params
    Object.entries(pagination).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.PUBLIC.REVIEWS(propertyName)}?${queryString}`
      : API_ENDPOINTS.PUBLIC.REVIEWS(propertyName);
    
    const response = await apiClient.get<PublicReviewsResponse>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to fetch public reviews');
    }
    
    return response.data;
  }

  // Approve a review for public display
  async approveReview(reviewId: string): Promise<ReviewEntity> {
    const response = await apiClient.post<{ review: ReviewEntity }>(
      API_ENDPOINTS.MANAGER.APPROVE_REVIEW,
      { reviewId }
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to approve review');
    }
    
    return response.data.review;
  }

  // Remove approval from a review
  async removeApproval(reviewId: string): Promise<ReviewEntity> {
    const response = await apiClient.delete<{ review: ReviewEntity }>(
      API_ENDPOINTS.MANAGER.REMOVE_APPROVAL,
      { reviewId }
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to remove approval');
    }
    
    return response.data.review;
  }

  // Sync reviews from external sources
  async syncReviews(): Promise<SyncResponse> {
    const response = await apiClient.post<SyncResponse>(
      API_ENDPOINTS.REVIEWS.SYNC
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to sync reviews');
    }
    
    return response.data;
  }

  // Get reviews from Hostaway (for testing/debugging)
  async getHostawayReviews(
    filters: Partial<ReviewFilters> = {},
    pagination: Partial<Pagination> = {}
  ): Promise<DashboardResponse> {
    const params = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    // Add pagination to query params
    Object.entries(pagination).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.REVIEWS.HOSTAWAY}?${queryString}`
      : API_ENDPOINTS.REVIEWS.HOSTAWAY;
    
    const response = await apiClient.get<DashboardResponse>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to fetch Hostaway reviews');
    }
    
    return response.data;
  }
}

// Create singleton instance
export const reviewsService = new ReviewsService();
