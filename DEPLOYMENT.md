# Deployment Guide for Vercel

This project is configured to deploy on Vercel with full functionality intact.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A Neon PostgreSQL database (or any PostgreSQL-compatible database)
3. Your repository pushed to GitHub, GitLab, or Bitbucket

## Environment Variables

Before deploying, you need to set up these environment variables in your Vercel project:

1. `DATABASE_URL` - Your PostgreSQL connection string (from Neon or other provider)
2. `SESSION_SECRET` - A random string for session encryption (generate one with: `openssl rand -base64 32`)
3. `NODE_ENV` - Set to `production`

### Setting Environment Variables in Vercel

1. Go to your project in the Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with the appropriate value
4. Make sure to add them for Production, Preview, and Development environments

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect the configuration from `vercel.json`
4. Add your environment variables (see above)
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Database Setup

After deploying, you need to push your database schema:

```bash
# Set your DATABASE_URL locally
export DATABASE_URL="your-database-url-here"

# Push the schema to your database
npm run db:push
```

## Verifying Deployment

1. Once deployed, visit your Vercel URL
2. The homepage should load correctly
3. Test API endpoints (e.g., `/api/products/list`)
4. Check the Vercel logs if you encounter any issues

## Project Structure

- `api/` - Serverless API handlers for Vercel
- `client/` - React frontend application
- `server/` - Express server code (adapted for serverless)
- `shared/` - Shared types and schemas
- `dist/` - Build output (generated during deployment)

## Build Process

The build process:
1. Builds the React frontend with Vite → `dist/public/`
2. Bundles the Express server with esbuild → `dist/index.cjs`
3. Creates serverless function in `api/` directory

## Troubleshooting

### Build Failures

- Check Vercel build logs for specific errors
- Ensure all dependencies are in `package.json` (not just `devDependencies`)
- Verify `tsx` is in dependencies (required for build)

### Database Connection Issues

- Verify `DATABASE_URL` is set correctly in Vercel environment variables
- Ensure your database allows connections from Vercel IPs
- For Neon, make sure you're using the pooled connection string

### Session Issues

- Make sure `SESSION_SECRET` is set in environment variables
- Note: In-memory session storage (`memorystore`) won't persist across serverless invocations
- Consider using `connect-pg-simple` for PostgreSQL-backed sessions in production

## Local Development

To run locally:

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev
```

## Production Build Locally

To test the production build locally:

```bash
# Build the project
npm run build

# Start production server
npm start
```
