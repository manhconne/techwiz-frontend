import type { Metadata } from 'next';
import {
  Playfair_Display,
  Source_Serif_4,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
  Outfit,
} from 'next/font/google';
import './globals.css';
import { CartWishlistProvider } from '../context/CartWishlistContext';
import { AuthProvider } from '../context/AuthContext';
import { PlayerProvider } from '../context/PlayerContext';
import { DomainProvider } from '../context/DomainContext';
import { GoogleTranslate } from '../components/GoogleTranslate';
import { Suspense } from 'react';
import { DomainSelectionModal } from '../components/DomainSelectionModal';
import { AnalyticsTracker } from '../components/AnalyticsTracker';

const fontOutfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-outfit',
});

const fontPlayfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair',
});

const fontSourceSerif = Source_Serif_4({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-source-serif',
});

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
});

const fontJetBrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jetbrains',
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
    <html
      lang="en"
      className={`${fontOutfit.variable} ${fontPlayfair.variable} ${fontSourceSerif.variable} ${fontSans.variable} ${fontJetBrains.variable}`}
    >
      <body className={`${fontSourceSerif.className} antialiased bg-white text-black selection:bg-black selection:text-white`}>
        <GoogleTranslate />
        <AuthProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
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