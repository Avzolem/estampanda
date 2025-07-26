# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Fill in required environment variables:
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `MONGODB_URI`: MongoDB connection string
   - `GOOGLE_ID` & `GOOGLE_SECRET`: From Google Cloud Console
   - `STRIPE_PUBLIC_KEY` & `STRIPE_SECRET_KEY`: From Stripe Dashboard
   - `RESEND_API_KEY`: From Resend Dashboard

## Architecture Overview

This is a **ShipFast** Next.js 14 (App Router) SaaS boilerplate with pre-built features for rapid startup development.

### Core Stack
- **Frontend**: Next.js 14 with React 18, Tailwind CSS + DaisyUI
- **Auth**: NextAuth.js v4 (Google OAuth + Magic Links)
- **Database**: MongoDB with Mongoose ODM
- **Payments**: Stripe (subscriptions + customer portal)
- **Email**: Resend for transactional emails
- **Support**: Crisp chat integration

### Key Architectural Decisions

1. **App Router Structure**: Uses Next.js 14 app directory with:
   - `(private)/` group for authenticated routes
   - Parallel route groups for user and admin dashboards
   - API routes in `/app/api/`

2. **Authentication Flow**:
   - NextAuth configuration in `/app/api/auth/[...nextauth]/route.js`
   - MongoDB adapter for session storage
   - Role-based access control (user, admin, editor, moderator)
   - Protected routes use `libs/next-auth.js` session checks

3. **Database Architecture**:
   - Models in `/models/` directory
   - User model with Stripe customer integration
   - Lead capture model for waitlist
   - Session management via NextAuth adapter

4. **Payment Integration**:
   - Stripe checkout flow: `/app/api/stripe/create-checkout/`
   - Webhook handling: `/app/api/webhook/stripe/`
   - Customer portal: `/app/api/stripe/create-portal/`
   - Plans configured in `config.js`

5. **Component Organization**:
   - Shared components in `/components/`
   - Route-specific components colocated with pages
   - Blog components in `/app/blog/_assets/components/`

### Configuration Management

**Central config file**: `config.js` contains:
- App metadata and branding
- Stripe pricing plans configuration
- Email settings and templates
- Theme/color customization
- Authentication redirect paths
- Customer support settings

### API Route Patterns

All API routes follow RESTful conventions:
- `/api/lead` - Lead capture
- `/api/stripe/*` - Payment operations
- `/api/admin/*` - Admin operations (protected)
- `/api/webhook/*` - External webhooks

### Styling Approach
- Tailwind CSS with custom animations (wiggle, popup, shimmer)
- DaisyUI component classes
- Theme switching support (light/dark)
- Custom gradients and glass morphism effects

### No Testing Framework
Currently no automated tests - consider adding Jest/React Testing Library for unit tests and Playwright for E2E tests when needed.