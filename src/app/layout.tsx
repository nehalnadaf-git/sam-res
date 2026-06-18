import type { Metadata, Viewport } from 'next';
import { Inter, Caveat, Kalam, Outfit } from 'next/font/google';
import './globals.css';
import PWARegistrar from '@/components/ui/PWARegistrar';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-script',
  display: 'swap',
});

const kalam = Kalam({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-hand',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Samiulla Shaikh — Senior Guest Service Associate',
  description:
    'Portfolio of Samiulla Shaikh — Highly seasoned Senior Guest Service Associate with superb attention to detail and an excellent customer service record. Experienced at Al Baik and Tara Emerald Hotel.',
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', rel: 'shortcut icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Samiulla',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F0EBE3',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable} ${kalam.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body>
        {children}
        <PWARegistrar />
      </body>
    </html>
  );
}
