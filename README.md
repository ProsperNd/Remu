# Remu - Modern E-commerce Platform

Remu is a feature-rich e-commerce platform built with Next.js, Firebase, and TailwindCSS, designed with an orange and white theme. This application provides a complete shopping experience with product browsing, user authentication, cart management, checkout with cryptocurrency support, and more.

## Features

- **Beautiful Orange & White Theme**: Modern UI with a consistent color scheme
- **Responsive Design**: Works on all devices from mobile to desktop
- **Product Catalog**: Browse products by category with search functionality
- **User Authentication**: Sign up, login, and profile management
- **Shopping Cart**: Add, remove, and manage products in your cart
- **Checkout**: Complete checkout flow with credit card and cryptocurrency payment options
- **Order History**: View and track past orders
- **Wishlist**: Save favorite products for later
- **Admin Dashboard**: Manage products, orders, and users (admin only)
- **Referral System**: Invite friends and earn rewards
- **Toast Notifications**: Provide immediate feedback on user actions

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/remu.git
cd remu
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Copy the contents from `.env.example` and fill in your Firebase credentials
   - Make sure to include all required Firebase configuration variables

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Firebase Setup

For this application to work correctly, you'll need to:

1. Set up Firebase Authentication with Email/Password provider
2. Create a Firestore Database
3. Set up Firebase Storage for product images
4. Update your security rules for Firestore and Realtime Database

#### Realtime Database Security Rules

To fix the warning about security rules, go to the Firebase Console > Realtime Database > Rules and add the following rules:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null && root.child('users').child(auth.uid).child('isAdmin').val() === true",
    "products": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('isAdmin').val() === true"
    },
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('isAdmin').val() === true",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('isAdmin').val() === true"
      }
    },
    "carts": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### Populating Sample Data

To populate the Firebase database with sample products:

```bash
npm run seed
```

This will add a variety of products across different categories to get you started.

## Cryptocurrency Payments

Remu supports cryptocurrency payments, allowing customers to purchase products using Bitcoin, Ethereum, and other cryptocurrencies. When a customer selects the cryptocurrency payment option during checkout, they provide their wallet address for potential refunds, and after placing the order, they receive instructions for completing the payment.

The cryptocurrency payment feature is integrated with the existing checkout flow, providing a seamless experience for customers who prefer to use digital currencies.

## Project Structure

- `/app` - Next.js app directory containing all components and pages
- `/app/components` - Reusable UI components
- `/app/context` - React context providers for state management
- `/app/firebase` - Firebase configuration and utility functions
- `/app/utils` - Utility functions and helper methods
- `/public` - Static assets including payment method icons
- `/scripts` - Helper scripts, including database seeding

## Customization

### Theme Colors

The theme colors are defined in `tailwind.config.ts`. The primary color is orange (`#FF7F00`) and the secondary color is white (`#FFFFFF`).

```js
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#FF7F00',
        'primary-dark': '#E67300',
        secondary: '#FFFFFF',
        'secondary-dark': '#F9F9F9',
      },
    },
  },
};
```

## Deployment

You can deploy this application to Vercel, Netlify, or any other hosting service that supports Next.js. See DEPLOYMENT.md for detailed instructions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact [ndubuezeprosper21@gmail.com](mailto:ndubuezeprosper21@gmail.com).

---

Built with ❤️ using Next.js, Firebase, and TailwindCSS.
