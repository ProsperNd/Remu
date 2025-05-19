# Remu E-commerce Platform Deployment Guide

This document provides detailed instructions for deploying the Remu e-commerce platform to various hosting environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Deployment](#local-deployment)
3. [Vercel Deployment](#vercel-deployment)
4. [Netlify Deployment](#netlify-deployment)
5. [Firebase Hosting Deployment](#firebase-hosting-deployment)
6. [Custom Server Deployment](#custom-server-deployment)
7. [Environment Variables](#environment-variables)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deployment, ensure you have:

- Node.js (v16 or newer)
- npm or yarn
- A Firebase project with Firestore enabled
- Git installed (for source control)
- Your Firebase configuration details

## Local Deployment

### Development Mode

To run the application in development mode:

```bash
npm run dev
```

This will start the application on [http://localhost:3000](http://localhost:3000).

### Production Mode

To build and run the application in production mode locally:

```bash
npm run build
npm run start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Vercel Deployment

Vercel is the simplest deployment option for Next.js applications:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Visit [Vercel](https://vercel.com) and sign up/sign in
3. Click "Import Project"
4. Select your repository
5. Configure your build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
6. Configure environment variables:
   - Add all your Firebase configuration from `.env.local`
7. Click "Deploy"

## Netlify Deployment

1. Push your code to a Git repository
2. Visit [Netlify](https://netlify.com) and sign up/sign in
3. Click "New site from Git"
4. Select your repository
5. Configure your build settings:
   - Build Command: `npm run build`
   - Publish Directory: `.next`
6. Configure environment variables:
   - Add all your Firebase configuration from `.env.local`
7. Click "Deploy site"

### Netlify Specific Configuration

This project includes a `netlify.toml` file with the necessary configuration for Next.js on Netlify. Make sure this file is included in your repository.

## Firebase Hosting Deployment

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set the public directory to `out`
   - Configure as a single-page app: `Yes`
   - Set up automatic builds and deploys: `No`

4. Modify your `next.config.js` to support static export:
   ```js
   module.exports = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     // other config...
   }
   ```

5. Update your build script in `package.json`:
   ```json
   "scripts": {
     "build": "next build && next export",
     // other scripts...
   }
   ```

6. Build the project:
   ```bash
   npm run build
   ```

7. Deploy to Firebase:
   ```bash
   firebase deploy --only hosting
   ```

## Custom Server Deployment

For deployment to a custom server (like AWS EC2, DigitalOcean, etc.):

1. Build the project on your local machine or CI/CD pipeline:
   ```bash
   npm run build
   ```

2. Transfer the following files/directories to your server:
   - `.next/`
   - `node_modules/`
   - `package.json`
   - `public/`
   - `.env.local` (with your environment variables)

3. On your server, install dependencies:
   ```bash
   npm install --production
   ```

4. Start the production server:
   ```bash
   npm run start
   ```

5. Set up a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "remu" -- start
   pm2 save
   pm2 startup
   ```

## Environment Variables

Ensure these environment variables are set in your deployment environment:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Troubleshooting

### Firebase Connection Issues
- Verify your Firebase project settings
- Ensure Firestore is enabled in your Firebase project
- Check that your Firebase rules allow read/write operations

### Build Errors
- Clear the `.next` directory and rebuild
- Update dependencies: `npm update`
- Check for TypeScript errors: `npx tsc --noEmit`

### Deployment Issues
- Check logs in your deployment platform
- Verify environment variables are correctly set
- Ensure your deployment platform supports Next.js

### Performance Issues
- Enable caching headers for static assets
- Consider using a CDN for image and static file delivery
- Use Firebase indexing for frequently queried collections 