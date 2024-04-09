import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meet Ball',
  description: 'Helps you find when we can meet together',
};

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          montserrat.variable,
          'bg-bgColor text-white'
        )}
      >
        {children}
      </body>
    </html>
  );
}
