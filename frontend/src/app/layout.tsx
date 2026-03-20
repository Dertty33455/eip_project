import type { Metadata } from 'next'
import React from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { NavigationProgress } from '@/components/ui/NavigationProgress'
import { ErrorBoundaryHandler } from '@/components/ui/ErrorBoundaryHandler'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

// Note: Ubuntu font removed from Google fetch to avoid build-time network fetch failures

export const metadata: Metadata = {
  title: 'BookShell - Plateforme Africaine de Livres & Audiobooks',
  description: 'Découvrez la première marketplace africaine de livres et livres audio. Achetez, vendez et partagez vos lectures avec la communauté.',
  keywords: ['livres africains', 'audiobooks', 'marketplace', 'littérature africaine', 'mobile money'],
  authors: [{ name: 'BookShell' }],
  openGraph: {
    title: 'BookShell - Plateforme Africaine de Livres & Audiobooks',
    description: 'Découvrez la première marketplace africaine de livres et livres audio.',
    url: 'https://BookShell.com',
    siteName: 'BookShell',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <ErrorBoundaryHandler />
          <NavigationProgress />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#292524',
                color: '#fff',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#1b5e20',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
