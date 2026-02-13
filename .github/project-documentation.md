# React Barcode Scanner - Project Documentation

## Overview

A React-based QR code and barcode scanner application with user authentication, duplicate detection, and scan history tracking. Built with React 19, TypeScript, Vite, and Material-UI.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 7.3.1 | Build Tool |
| Material-UI | Latest | UI Components |
| React Router DOM | Latest | Client-side Routing |
| react-qr-barcode-scanner | Latest | Camera QR Scanning |

## Project Structure

```
src/
├── auth/                    # Authentication pages
│   ├── login/
│   │   └── Login.tsx        # User login page
│   └── sign-up/
│       └── SignUp.tsx       # User registration page
├── components/              # Reusable components
│   └── ProtectedRoute.tsx   # Auth guard for protected routes
├── context/                 # React contexts
│   └── AuthContext.tsx      # Authentication state management
├── pages/                   # Main application pages
│   ├── Home.tsx             # Dashboard with scan button
│   └── Scanner.tsx          # QR/Barcode scanner page
├── services/                # API and data services
│   ├── api.config.ts        # API configuration and constants
│   ├── auth.service.ts      # Authentication API calls
│   ├── mock.data.ts         # Mock data for development
│   └── scanner.service.ts   # Scanner API calls
├── App.tsx                  # Main app with routing configuration
├── main.tsx                 # Application entry point with providers
├── App.css                  # App-specific styles (unused)
└── index.css                # Global styles
```

---

## Features Implemented

### 1. Authentication System

#### Login Page (`src/auth/login/Login.tsx`)
- Username and password form fields
- Password visibility toggle
- Form validation (required fields)
- Error message display
- Demo credentials hint: `demo` / `demo123`
- Redirect to home on successful login
- Auto-redirect if already authenticated
- Link to sign-up page

#### Sign Up Page (`src/auth/sign-up/SignUp.tsx`)
- Registration form fields: username, email, password, confirm password
- Input validation rules:
  - Username: minimum 3 characters
  - Email: valid email format
  - Password: minimum 6 characters
  - Passwords must match
- Duplicate username/email detection
- Success message with auto-redirect to login
- Link to login page

#### Auth Context (`src/context/AuthContext.tsx`)
Provides global authentication state and methods:

```typescript
interface AuthContextType {
  user: AuthUser | null;          // Current user data
  isAuthenticated: boolean;       // Login status
  isLoading: boolean;             // Loading state
  login: (username, password) => Promise<{success, error?}>;
  signup: (username, email, password) => Promise<{success, message?, error?}>;
  logout: () => void;
}
```

#### Protected Route (`src/components/ProtectedRoute.tsx`)
- Wraps routes requiring authentication
- Shows loading spinner during auth check
- Redirects to `/login` if unauthenticated
- Preserves return URL for post-login redirect

---

### 2. QR Code Scanner

#### Scanner Page (`src/pages/Scanner.tsx`)
- Camera-based QR code and barcode scanning
- Real-time code detection using device camera
- Scan states with visual feedback:
  - `scanning` - Camera active, waiting for code
  - `processing` - Code detected, submitting to API
  - `success` - Scan submitted successfully (green)
  - `duplicate` - Code already scanned (yellow/warning)
  - `error` - Submission failed (red)
- Camera error handling:
  - Permission denied message
  - No camera found message
  - Generic error with retry option
- "Scan Another" button to restart scanning
- "Back to Home" navigation
- Scanning overlay guide (frame indicator)

#### Home Page (`src/pages/Home.tsx`)
- App bar with title and logout button
- Welcome message with username
- Large scan button with hover animation
- Step-by-step instructions card
- Click anywhere on scan card to navigate

---

### 3. Service Layer

#### API Configuration (`src/services/api.config.ts`)

```typescript
// Toggle between mock and real API
export const USE_MOCK = true;

// Base URL - update when real API available
export const BASE_URL = 'https://api.example.com';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    VALIDATE: '/auth/validate',
    LOGOUT: '/auth/logout',
  },
  SCANNER: {
    SUBMIT: '/scan/submit',
    CHECK_DUPLICATE: '/scan/check',
    HISTORY: '/scan/history',
  },
};

// Storage keys for localStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
};

// Timing constants
export const API_TIMEOUT = 10000;  // 10 seconds
export const MOCK_DELAY = 500;     // 500ms simulated latency
```

#### Auth Service (`src/services/auth.service.ts`)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `login` | `username, password` | `LoginResponse` | Authenticate user |
| `signup` | `username, email, password` | `SignupResponse` | Register new user |
| `validateToken` | none | `ValidateResponse` | Verify stored token |
| `logout` | none | `void` | Clear auth data |
| `getToken` | none | `string \| null` | Get current token |
| `getCurrentUser` | none | `AuthUser \| null` | Get user from storage |

#### Scanner Service (`src/services/scanner.service.ts`)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `submitScan` | `scannedData` | `ScanSubmitResponse` | Submit scanned code |
| `checkDuplicate` | `scannedData` | `{isDuplicate, error?}` | Check if code exists |
| `getScanHistory` | none | `ScanHistoryResponse` | Get user's scan history |

#### Mock Data (`src/services/mock.data.ts`)
- Pre-seeded test user: `demo` / `demo123`
- In-memory storage for scanned codes (resets on refresh)
- Helper functions for user and scan management

---

## Routing Configuration

| Path | Component | Access | Description |
|------|-----------|--------|-------------|
| `/login` | Login | Public | User login page |
| `/signup` | SignUp | Public | User registration |
| `/` | Home | Protected | Dashboard with scan button |
| `/scan` | Scanner | Protected | QR scanner camera view |
| `*` | Redirect | - | Catch-all redirects to `/` |

---

## Data Models

### AuthUser
```typescript
interface AuthUser {
  id: number;
  username: string;
  email: string;
}
```

### ScannedCode
```typescript
interface ScannedCode {
  id: string;
  data: string;
  scannedAt: string;  // ISO timestamp
  userId: number;
}
```

### API Responses
```typescript
interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}

interface SignupResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface ScanSubmitResponse {
  success: boolean;
  duplicate?: boolean;
  message?: string;
  scanId?: string;
  error?: string;
}
```

---

## Switching from Mock to Real API

### Step 1: Update Configuration
Open `src/services/api.config.ts`:
```typescript
export const USE_MOCK = false;  // Change from true to false
export const BASE_URL = 'https://your-api-domain.com';  // Your API URL
```

### Step 2: Implement API Endpoints

| Endpoint | Method | Request Body | Success Response | Error Response |
|----------|--------|--------------|------------------|----------------|
| `/auth/login` | POST | `{username, password}` | `{token, user}` | `{message}` |
| `/auth/signup` | POST | `{username, email, password}` | `{message}` | `{message}` |
| `/auth/validate` | GET | Header: `Authorization: Bearer {token}` | `{user}` | 401 |
| `/scan/submit` | POST | `{data, timestamp}` | `{success, scanId}` | 409 for duplicate |
| `/scan/check` | GET | Query: `?data={encoded}` | `{isDuplicate}` | `{message}` |
| `/scan/history` | GET | Header: `Authorization: Bearer {token}` | `{scans: [...]}` | `{message}` |

### Step 3: Authentication Header
All protected endpoints expect:
```
Authorization: Bearer <token>
```

---

## Scripts

```bash
npm install      # Install dependencies
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## Testing the Application

### Quick Test Flow
1. Run `npm run dev`
2. Open `http://localhost:5173`
3. You'll be redirected to `/login`
4. Login with `demo` / `demo123`
5. Click "Start Scanning"
6. Allow camera access
7. Scan any QR code
8. See success message
9. Scan same code again → duplicate warning

### Test Scenarios
- [ ] Login with invalid credentials → Error message
- [ ] Login with valid credentials → Redirect to home
- [ ] Refresh page while logged in → Stay logged in
- [ ] Sign up with existing username → Error message
- [ ] Sign up with new user → Success, redirect to login
- [ ] Access `/scan` without login → Redirect to login
- [ ] Deny camera permission → Error message with retry
- [ ] Scan new QR code → Success message
- [ ] Scan duplicate QR code → Duplicate warning
- [ ] Logout → Clear token, redirect to login

---

## Key Implementation Notes

### Camera Handling
- Uses `facingMode: "environment"` for rear camera (mobile)
- Falls back to available camera on desktop
- Handles permission errors gracefully
- Uses `stopStream` prop to prevent browser freeze on unmount

### Security Considerations
- Tokens stored in localStorage (consider httpOnly cookies for production)
- Bearer token authentication
- Protected routes with auth guard
- Password fields use `type="password"` with toggle

### UI/UX Features
- Loading spinners during all async operations
- Form validation with inline error messages
- Snackbar notifications for scan results
- Responsive design (works on mobile and desktop)
- Material-UI theming with primary color #1976d2

---

## Dependencies

### Production Dependencies
```json
{
  "@mui/material": "^latest",
  "@mui/icons-material": "^latest",
  "@emotion/react": "^latest",
  "@emotion/styled": "^latest",
  "react-router-dom": "^latest",
  "react-qr-barcode-scanner": "^latest"
}
```

### Key Dev Dependencies
```json
{
  "typescript": "~5.9.3",
  "vite": "^7.3.1",
  "eslint": "^9.39.1",
  "babel-plugin-react-compiler": "^1.0.0"
}
```

---

## Future Enhancements (Not Implemented)

- [ ] Scan history page with list of previous scans
- [ ] Export scan data to CSV/JSON
- [ ] Multiple camera selection (front/back toggle)
- [ ] Flashlight/torch toggle for low-light scanning
- [ ] Offline mode with local storage and sync
- [ ] Push notifications for scan confirmations
- [ ] Admin dashboard for managing users/scans
- [ ] Batch scanning mode
- [ ] Scan analytics and reporting

---

## Troubleshooting

### Camera not working
1. Ensure HTTPS or localhost (camera requires secure context)
2. Check browser permissions for camera access
3. Try different browser (Chrome/Safari recommended)

### Login not working
1. Check if `USE_MOCK = true` in api.config.ts
2. Use demo credentials: `demo` / `demo123`
3. Clear localStorage and try again

### Build errors
1. Run `npm install` to ensure all dependencies
2. Check TypeScript errors with `npm run lint`
3. Ensure Node.js version 18+ is installed

---

## Contact / Support

For issues or questions about this implementation, refer to:
- This documentation file
- Inline code comments in each file
- React and Material-UI official documentation
