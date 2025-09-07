// API configuration for the frontend
// This file provides a centralized way to manage API URLs

// Dynamic API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:8000/api' : window.location.origin + '/api')

/**
 * Get the full API URL for a given endpoint
 * @param endpoint - The API endpoint (e.g., '/users', '/campaigns/email')
 * @returns The full URL for the API endpoint
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${API_URL}/${cleanEndpoint}`
}

/**
 * Get the base API URL
 * @returns The base API URL
 */
export function getBaseApiUrl(): string {
  return API_URL
}

// Export the API URL for direct use if needed
export { API_URL }
