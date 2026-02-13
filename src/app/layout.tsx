import type { Metadata } from 'next'
import { Inter, Playfair_Display, Ubuntu } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

const ubuntu = Ubuntu({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu',
})

export const metadata: Metadata = {
  title: 'AfriBook - Plateforme Africaine de Livres & Audiobooks',
  description: 'Découvrez la première marketplace africaine de livres et livres audio. Achetez, vendez et partagez vos lectures avec la communauté.',
  keywords: ['livres africains', 'audiobooks', 'marketplace', 'littérature africaine', 'mobile money'],
  authors: [{ name: 'AfriBook' }],
  openGraph: {
    title: 'AfriBook - Plateforme Africaine de Livres & Audiobooks',
    description: 'Découvrez la première marketplace africaine de livres et livres audio.',
    url: 'https://afribook.com',
    siteName: 'AfriBook',
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
    <html lang="fr" className={`${inter.variable} ${playfair.variable} ${ubuntu.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
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
      </body>
    </html>
  )
}
