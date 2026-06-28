import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: 'Pollar Crowdfunding',
  description: 'Decentralized crowdfunding powered by Pollar and Stellar escrow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Providers>
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}