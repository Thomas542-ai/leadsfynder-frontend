# LeadsFynder Frontend

React frontend application for the LeadsFynder lead management system.

## Features

- **Dashboard**: Analytics overview and key metrics
- **Lead Management**: Complete lead lifecycle management
- **Email Campaigns**: Email marketing campaign management
- **Lead Sources**: Source tracking and management
- **WhatsApp Integration**: WhatsApp outreach capabilities
- **Admin Panel**: Administrative functions and user management
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Icons**: Heroicons

## Pages

- **Dashboard** (`/dashboard`) - Main analytics dashboard
- **Lead Manager** (`/leads`) - Lead management interface
- **Lead Sources** (`/lead-sources`) - Source management
- **Email Campaigns** (`/campaigns`) - Email marketing
- **WhatsApp Outreach** (`/whatsapp`) - WhatsApp integration
- **Pricing** (`/pricing`) - Pricing information
- **Admin Panel** (`/admin`) - Administrative functions

## Environment Variables

Create a `env.local` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# App Configuration
VITE_APP_NAME=LeadsFynder
VITE_APP_VERSION=1.0.0
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## Deployment

This frontend is designed to be deployed on platforms like:
- Vercel (recommended)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in Vercel dashboard

### Environment Variables for Production

Set these in your deployment platform:
- `VITE_API_URL` - Your backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## Project Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Utility functions
├── config/             # Configuration files
└── App.tsx             # Main app component
```

## API Integration

The frontend communicates with the backend API through:
- Authentication service (`services/auth.ts`)
- API configuration (`config/api.ts`)
- Custom hooks (`hooks/useAuth.ts`)
