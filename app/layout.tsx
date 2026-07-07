import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryProvider } from '@/providers/QueryProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'GymFlow | Gym Management SaaS Platform',
    template: '%s | GymFlow',
  },

  description:
    'Modern gym management software for fitness centers, personal trainers, and health clubs. Manage members, trainers, attendance, billing, analytics, and operations in one platform.',

  keywords: [
    'gym management software',
    'fitness center management',
    'gym SaaS',
    'member management',
    'attendance tracking',
    'trainer management',
    'fitness analytics',
    'billing software',
    'health club software',
  ],

  authors: [{ name: 'GymFlow Team' }],
  creator: 'GymFlow',
  publisher: 'GymFlow',

  applicationName: 'GymFlow',

  metadataBase: new URL('https://yourdomain.com'),

  openGraph: {
    title: 'GymFlow | Gym Management SaaS Platform',
    description:
      'All-in-one gym management platform for modern fitness businesses.',
    url: 'https://yourdomain.com',
    siteName: 'GymFlow',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GymFlow Dashboard',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'GymFlow | Gym Management SaaS Platform',
    description:
      'Manage members, attendance, trainers, billing and analytics with GymFlow.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ToastProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
