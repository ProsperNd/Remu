import { Inter } from 'next/font/google';
import { AuthProvider } from './context/AuthContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

export const metadata = {
  title: 'Remu - Online Shopping',
  description: 'Shop the latest trends at unbeatable prices',
};

function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-50">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
} 