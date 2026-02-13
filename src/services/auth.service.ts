/**
 * Authentication Service
 * Handles login, signup, and token validation
 * Supports both mock and real API modes
 */

import {
  USE_MOCK,
  BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
  MOCK_DELAY,
} from './api.config';
import {
  validateCredentials,
  addMockUser,
  findUserByUsername,
  findUserByEmail,
  generateMockToken,
} from './mock.data';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}

export interface SignupResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ValidateResponse {
  valid: boolean;
  user?: AuthUser;
}

/**
 * Simulate API delay for mock mode
 */
const simulateDelay = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
};

/**
 * Login user with username and password
 */
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  if (USE_MOCK) {
    await simulateDelay();

    const user = validateCredentials(username, password);
    if (user) {
      const token = generateMockToken(user.id);
      const authUser: AuthUser = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      // Store token and user data
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authUser));

      return {
        success: true,
        token,
        user: authUser,
      };
    }

    return {
      success: false,
      error: 'Invalid username or password',
    };
  }

  // Real API call
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    }

    return {
      success: false,
      error: data.message || 'Login failed',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};

/**
 * Register a new user
 */
export const signup = async (
  username: string,
  email: string,
  password: string
): Promise<SignupResponse> => {
  if (USE_MOCK) {
    await simulateDelay();

    // Check if username already exists
    if (findUserByUsername(username)) {
      return {
        success: false,
        error: 'Username already taken',
      };
    }

    // Check if email already exists
    if (findUserByEmail(email)) {
      return {
        success: false,
        error: 'Email already registered',
      };
    }

    // Add new user
    addMockUser(username, email, password);

    return {
      success: true,
      message: 'Account created successfully. Please login.',
    };
  }

  // Real API call
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.AUTH.SIGNUP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Account created successfully',
      };
    }

    return {
      success: false,
      error: data.message || 'Signup failed',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};

/**
 * Validate stored auth token
 */
export const validateToken = async (): Promise<ValidateResponse> => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

  if (!token || !userData) {
    return { valid: false };
  }

  if (USE_MOCK) {
    await simulateDelay();

    // In mock mode, just check if token exists and starts with our prefix
    if (token.startsWith('mock-jwt-token-')) {
      try {
        const user = JSON.parse(userData) as AuthUser;
        return { valid: true, user };
      } catch {
        return { valid: false };
      }
    }
    return { valid: false };
  }

  // Real API call
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.AUTH.VALIDATE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { valid: true, user: data.user };
    }

    // Token invalid, clear storage
    logout();
    return { valid: false };
  } catch (error) {
    return { valid: false };
  }
};

/**
 * Logout user and clear stored data
 */
export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

/**
 * Get current auth token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Get current user data from storage
 */
export const getCurrentUser = (): AuthUser | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (userData) {
    try {
      return JSON.parse(userData) as AuthUser;
    } catch {
      return null;
    }
  }
  return null;
};
