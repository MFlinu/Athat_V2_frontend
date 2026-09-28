// athar-frontend/app/layout.tsx
import { Tajawal, Amiri, Inter } from 'next/font/google';
import './globals.css';
import PWAHandler from '@/components/PWAHandler';
import BottomNav from '@/components/BottomNav';

const tajawal = Tajawal({ subsets: ['arabic'], weight: ['300','400','500','700'], variable: '--font-tajawal' });
const amiri = Amiri({ subsets: ['arabic','latin'], weight: ['400','700'], variable: '--font-amiri' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'أثر | موسوعة أهل البيت',
  description: 'موسوعة رقمية موثقة لسيرة النبي ﷺ والأئمة المعصومين (ع)',
  manifest: '/manifest.json',
  icons: { icon: '/icons/icon-192x192.png', apple: '/icons/icon-192x192.png' }
};

export const viewport = {
  themeColor: '#0D5C4C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${tajawal.variable} ${amiri.variable} ${inter.variable} font-arabic pb-20 md:pb-0`}>
        {children}
        <PWAHandler />
        <BottomNav />
      </body>
    </html>
  );
}