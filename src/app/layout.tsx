import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ThemeProvider } from '@/components/shared/theme-provider'
import { MotionProvider } from '@/components/shared/motion-provider'
import { PlaceholderFill } from '@/components/shared/placeholder-fill'
import { SkipToMain } from '@/components/shared/skip-to-main'
import { CookieConsent } from '@/components/shared/cookie-consent'
import { siteConfig } from '@/config/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Truck Dispatch Services`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'truck dispatch service',
    'owner operator dispatch',
    'freight dispatcher',
    'dry van dispatch',
    'reefer dispatch',
    'flatbed dispatch',
    'load booking',
    'trucking dispatch company',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1520' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col antialiased">
        <script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration='manual'" }} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <MotionProvider>
            <SkipToMain />
            {children}
            <PlaceholderFill />
            <CookieConsent />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
