import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartWishlistProvider } from '../context/CartWishlistContext';
import { AuthProvider } from '../context/AuthContext';
import { PlayerProvider } from '../context/PlayerContext';
import { DomainProvider } from '../context/DomainContext';
import { GoogleTranslate } from '../components/GoogleTranslate';
import { DomainSelectionModal } from '../components/DomainSelectionModal';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fan Hub Plus | Official K-Pop Album E-Commerce & Fandom Universe',
  description:
    'Explore official K-pop albums, limited photocards, world tour tickets, and merchandise from NewJeans, BLACKPINK, BTS, Stray Kids, IVE, and aespa. Counted on Hanteo & Circle Charts.',
  keywords: 'K-Pop albums, photocards, lightsticks, NewJeans, BLACKPINK, BTS, Stray Kids, IVE, aespa, Hanteo Chart',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontSans.className}>
      <body>
        <GoogleTranslate />
        <AuthProvider>
          <DomainProvider>
            <CartWishlistProvider>
              <PlayerProvider>
                {children}
                <DomainSelectionModal />
                              </PlayerProvider>
            </CartWishlistProvider>
          </DomainProvider>
        </AuthProvider>
      </body>
    </html>
  );
}