import type { Metadata, Viewport } from 'next';
import ServiceWorker from '@/components/ServiceWorker';
import NetworkStatus from '@/components/NetworkStatus';
import InstallPWA from '@/components/InstallPWA';
import SocketProvider from '@/components/SocketProvider/SocketProvider';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'TechStore',
  description: 'Интернет-магазин электроники',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TechStore',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f0f1a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <NetworkStatus />
        {children}
        <InstallPWA />
        <SocketProvider />
        <ServiceWorker />
      </body>
    </html>
  );
}
