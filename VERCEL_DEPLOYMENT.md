# Vercel Serverless Deployment for NestJS

## Changes Made

### 1. Created `api/index.ts`
- Vercel serverless function entrypoint
- Bootstraps NestJS app using ExpressAdapter
- Caches the app instance between invocations (reduces cold boot time)
- Handles all HTTP requests and forwards them to NestJS

### 2. Updated `vercel.json`
- Routes all requests to `/api/index.ts`
- Configures build settings for TypeScript
- Sets function memory and timeout limits

### 3. Updated `package.json`
- Added `build` script to compile TypeScript
- Added `vercel-build` script for Vercel deployment
- Added `express` and `@types/express` dependencies

### 4. Updated `tsconfig.json`
- Included `api/**/*` in compilation

### 5. Updated `app.controller.ts`
- Root route (`GET /`) returns `{ ok: true, service: "app-auth" }`
- Added `GET /health` endpoint

## Why Vercel Showed 404

**The Problem:**
- Vercel was looking for a serverless function at `./index.js` (as specified in old `vercel.json`)
- This file didn't exist, so Vercel couldn't find any handler
- NestJS apps need a special entrypoint to work as serverless functions

**The Solution:**
- Created `api/index.ts` as a proper Vercel serverless function
- This file exports a default async handler that:
  1. Initializes NestJS once (cached in global variable)
  2. Forwards all requests to the Express app instance
  3. Handles errors gracefully

## Local Testing

To test locally with Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

## Deployment

1. Push to your repository
2. Vercel will automatically detect and build
3. The build process runs `vercel-build` which:
   - Compiles TypeScript (`npm run build`)
   - Generates Prisma client (`npm run prisma:generate`)

## Routes

All existing routes work:
- `GET /` - Returns `{ ok: true, service: "app-auth" }`
- `GET /health` - Health check
- `POST /auth/login` - Login endpoint
- All other existing routes continue to work

## Notes

- The app is cached between invocations for better performance
- Body parsing is handled automatically
- CORS is configured to allow all origins
- All middleware and guards work as expected

