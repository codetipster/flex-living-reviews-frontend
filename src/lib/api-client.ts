import { API_CONFIG, API_ENDPOINTS, HTTP_METHODS, REQUEST_HEADERS, CONTENT_TYPES, ERROR_CODES } from '@/constants/api';
import type { ApiResponse, ApiError, NetworkError } from '@/types/api';

// Request configuration interface
interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// API Client class
class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private defaultRetryDelay: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultTimeout = API_CONFIG.TIMEOUT;
    this.defaultRetries = API_CONFIG.RETRY_ATTEMPTS;
    this.defaultRetryDelay = API_CONFIG.RETRY_DELAY;
  }

  // Generate request ID for tracking
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create headers with defaults
  private createHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    return {
      [REQUEST_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
      [REQUEST_HEADERS.X_REQUEST_ID]: this.generateRequestId(),
      ...customHeaders,
    };
  }

  // Handle response
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      throw new Error('Failed to parse response');
    }

    if (!response.ok) {
      const error: ApiError = {
        message: data?.error?.message || data?.message || 'Request failed',
        code: data?.error?.code || ERROR_CODES.INTERNAL_SERVER_ERROR,
        context: data?.error?.context,
      };

      throw error;
    }

    return data as ApiResponse<T>;
  }

  // Retry logic
  private async withRetry<T>(
    requestFn: () => Promise<T>,
    retries: number = this.defaultRetries,
    delay: number = this.defaultRetryDelay
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await this.delay(delay);
        return this.withRetry(requestFn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  // Check if error is retryable
  private isRetryableError(error: any): boolean {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return true; // Network error
    }
    if (error.status >= 500) {
      return true; // Server error
    }
    if (error.status === 429) {
      return true; // Rate limit
    }
    return false;
  }

  // Delay utility
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Main request method
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = HTTP_METHODS.GET,
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = this.createHeaders(headers);

    const requestFn = async (): Promise<ApiResponse<T>> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return this.handleResponse<T>(response);
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            const timeoutError: NetworkError = {
              message: 'Request timeout',
              status: 408,
            };
            throw timeoutError;
          }
          
          if (error.message === 'Failed to fetch') {
            const networkError: NetworkError = {
              message: 'Network error - please check your connection',
            };
            throw networkError;
          }
        }
        
        throw error;
      }
    };

    return this.withRetry(requestFn, retries, retryDelay);
  }

  // HTTP Methods
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: HTTP_METHODS.GET, headers });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: HTTP_METHODS.POST, body, headers });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: HTTP_METHODS.PUT, body, headers });
  }

  async delete<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: HTTP_METHODS.DELETE, body, headers });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: HTTP_METHODS.PATCH, body, headers });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export for testing
export { ApiClient };
