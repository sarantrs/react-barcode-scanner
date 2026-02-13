/**
 * Mock Data for Development
 * This file contains mock users and scanned codes for testing
 * Remove or ignore this file when using real API
 */

export interface MockUser {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface ScannedCode {
  id: string;
  data: string;
  scannedAt: string;
  userId: number;
}

// Pre-seeded mock users - demo/demo123 for quick testing
export const mockUsers: MockUser[] = [
  {
    id: 1,
    username: 'demo',
    email: 'demo@example.com',
    password: 'demo123',
  },
];

// In-memory storage for scanned codes (resets on page refresh)
export const scannedCodes: ScannedCode[] = [];

// Counter for generating unique IDs
let userIdCounter = mockUsers.length;
let scanIdCounter = 0;

/**
 * Generate a mock JWT token
 */
export const generateMockToken = (userId: number): string => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

/**
 * Add a new user to mock database
 */
export const addMockUser = (
  username: string,
  email: string,
  password: string
): MockUser => {
  userIdCounter++;
  const newUser: MockUser = {
    id: userIdCounter,
    username,
    email,
    password,
  };
  mockUsers.push(newUser);
  return newUser;
};

/**
 * Find user by username
 */
export const findUserByUsername = (username: string): MockUser | undefined => {
  return mockUsers.find((user) => user.username === username);
};

/**
 * Find user by email
 */
export const findUserByEmail = (email: string): MockUser | undefined => {
  return mockUsers.find((user) => user.email === email);
};

/**
 * Validate user credentials
 */
export const validateCredentials = (
  username: string,
  password: string
): MockUser | null => {
  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
};

/**
 * Check if a QR code has already been scanned
 */
export const isCodeAlreadyScanned = (data: string): boolean => {
  return scannedCodes.some((code) => code.data === data);
};

/**
 * Add a scanned code to the database
 */
export const addScannedCode = (data: string, userId: number): ScannedCode => {
  scanIdCounter++;
  const newScan: ScannedCode = {
    id: `scan-${scanIdCounter}`,
    data,
    scannedAt: new Date().toISOString(),
    userId,
  };
  scannedCodes.push(newScan);
  return newScan;
};

/**
 * Get scan history for a user
 */
export const getUserScanHistory = (userId: number): ScannedCode[] => {
  return scannedCodes.filter((code) => code.userId === userId);
};
