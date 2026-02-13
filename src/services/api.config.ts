/**
 * API Configuration
 * Toggle USE_MOCK to switch between mock and real API
 * Update BASE_URL when real API is ready
 */

// Set to false when real API is ready
export const USE_MOCK = true;

// Base URL for API endpoints - update this when real API is available
export const BASE_URL = 'https://api.example.com';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    VALIDATE: '/auth/validate',
    LOGOUT: '/auth/logout',
  },
  // Scanner endpoints
  SCANNER: {
    SUBMIT: '/scan/submit',
    CHECK_DUPLICATE: '/scan/check',
    HISTORY: '/scan/history',
  },
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

// API request timeout (in milliseconds)
export const API_TIMEOUT = 10000;

// Mock delay for simulating API latency (in milliseconds)
export const MOCK_DELAY = 500;
