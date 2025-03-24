# Remu - Fashion E-commerce Platform

A modern e-commerce platform built with Next.js, Firebase, and Tailwind CSS.

## Features

- User authentication with email/password
- Admin dashboard for product management
- Product catalog with categories
- Shopping cart functionality
- User profiles with points system
- Referral system
- Responsive design

## Tech Stack

- Next.js 14
- Firebase (Auth, Firestore, Storage)
- Tailwind CSS
- TypeScript

## Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/remu.git
cd remu
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Deployment to Vercel

1. Push your code to GitHub

2. Connect your GitHub repository to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. Configure environment variables in Vercel:
   - Go to your project settings
   - Add all environment variables from `.env.local`

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication with email/password
3. Create a Firestore database
4. Set up Storage rules
5. Add your Firebase configuration to environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.