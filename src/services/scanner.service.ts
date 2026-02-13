/**
 * Scanner Service
 * Handles QR code scan submission and duplicate checking
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
  isCodeAlreadyScanned,
  addScannedCode,
  getUserScanHistory,
  type ScannedCode,
} from './mock.data';
import { getCurrentUser } from './auth.service';

export interface ScanSubmitResponse {
  success: boolean;
  duplicate?: boolean;
  message?: string;
  scanId?: string;
  error?: string;
}

export interface ScanHistoryResponse {
  success: boolean;
  scans?: ScannedCode[];
  error?: string;
}

/**
 * Simulate API delay for mock mode
 */
const simulateDelay = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
};

/**
 * Get authorization header
 */
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Submit a scanned QR code
 */
export const submitScan = async (
  scannedData: string
): Promise<ScanSubmitResponse> => {
  if (USE_MOCK) {
    await simulateDelay();

    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    // Check for duplicate
    if (isCodeAlreadyScanned(scannedData)) {
      return {
        success: false,
        duplicate: true,
        message: 'This QR code has already been scanned',
      };
    }

    // Add to scanned codes
    const scan = addScannedCode(scannedData, user.id);

    return {
      success: true,
      message: 'QR code scanned successfully',
      scanId: scan.id,
    };
  }

  // Real API call
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.SCANNER.SUBMIT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        data: scannedData,
        timestamp: new Date().toISOString(),
      }),
    });

    const data = await response.json();

    // Handle duplicate response (typically 409 Conflict)
    if (response.status === 409 || data.duplicate) {
      return {
        success: false,
        duplicate: true,
        message: data.message || 'This QR code has already been scanned',
      };
    }

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'QR code scanned successfully',
        scanId: data.scanId,
      };
    }

    return {
      success: false,
      error: data.message || 'Failed to submit scan',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};

/**
 * Check if a QR code has already been scanned
 */
export const checkDuplicate = async (
  scannedData: string
): Promise<{ isDuplicate: boolean; error?: string }> => {
  if (USE_MOCK) {
    await simulateDelay();
    return {
      isDuplicate: isCodeAlreadyScanned(scannedData),
    };
  }

  // Real API call
  try {
    const encodedData = encodeURIComponent(scannedData);
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.SCANNER.CHECK_DUPLICATE}?data=${encodedData}`,
      {
        method: 'GET',
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      return {
        isDuplicate: data.isDuplicate || false,
      };
    }

    return {
      isDuplicate: false,
      error: data.message || 'Failed to check duplicate',
    };
  } catch (error) {
    return {
      isDuplicate: false,
      error: 'Network error',
    };
  }
};

/**
 * Get scan history for the current user
 */
export const getScanHistory = async (): Promise<ScanHistoryResponse> => {
  if (USE_MOCK) {
    await simulateDelay();

    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    const scans = getUserScanHistory(user.id);
    return {
      success: true,
      scans,
    };
  }

  // Real API call
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.SCANNER.HISTORY}`, {
      method: 'GET',
      headers: {
        ...getAuthHeader(),
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        scans: data.scans || [],
      };
    }

    return {
      success: false,
      error: data.message || 'Failed to fetch scan history',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};
