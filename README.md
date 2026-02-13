# React QR Barcode Scanner

A React-based QR code and barcode scanner application with user authentication, duplicate detection, and scan tracking.

## Features

- **User Authentication** - Login and sign-up with form validation
- **QR/Barcode Scanning** - Camera-based scanning using device camera
- **Duplicate Detection** - Prevents scanning the same code twice
- **Protected Routes** - Scanner only accessible to authenticated users
- **Mock API Mode** - Works out of the box without backend

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Material-UI (MUI)
- React Router DOM
- react-qr-barcode-scanner

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Demo Credentials

```
Username: demo
Password: demo123
```

## Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sarantrs/react-barcode-scanner)

### Option 2: Import from GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite and configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

### Option 3: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Environment Variables (Optional)

If switching to a real API, add these in Vercel dashboard:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your API base URL |
| `VITE_USE_MOCK` | Set to `false` for real API |

## Project Structure

```
src/
├── auth/           # Login and Sign-up pages
├── components/     # Reusable components
├── context/        # Auth context provider
├── pages/          # Home and Scanner pages
├── services/       # API services and mock data
├── App.tsx         # Routing configuration
└── main.tsx        # App entry point
```

## Configuration

### Switching to Real API

Edit `src/services/api.config.ts`:

```typescript
export const USE_MOCK = false;  // Change to false
export const BASE_URL = 'https://your-api.com';  // Your API URL
```

## Documentation

See [.github/project-documentation.md](.github/project-documentation.md) for detailed documentation.

## License

MIT
