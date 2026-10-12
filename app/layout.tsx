import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeSync } from '@/components/theme-sync'
import { QueryProvider } from '@/providers/QueryProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { AppErrorBoundary } from '@/components/providers/AppErrorBoundary'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

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
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/icon.svg',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1a1a1a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;var ownerPath=p.indexOf('/owner')===0;var isOwner=false;if(ownerPath){var raw=localStorage.getItem('gym-auth-storage');if(raw){var s=JSON.parse(raw).state;if(s&&s.user&&s.user.role==='OWNER')isOwner=true}}if(ownerPath&&isOwner){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light')}else{document.documentElement.classList.remove('light');document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="gymflow-theme"
          themes={['dark', 'light']}
        >
          <ThemeSync />
          <QueryProvider>
            <ToastProvider>
              <AuthProvider>
                <AppErrorBoundary>{children}</AppErrorBoundary>
              </AuthProvider>
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
