'use client'

import { useEffect } from 'react'

export function ErrorBoundaryHandler() {
  // Gestionnaire d'erreurs global pour les extensions tierces
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Ignorer les erreurs connues des extensions de navigateur
      if (
        event.filename?.includes('bootstrap-autofill-overlay-notifications.js') ||
        event.filename?.includes('autofill') ||
        event.message?.includes('Cannot read properties of null (reading \'includes\')') ||
        event.message?.includes('AutofillOverlayContentService')
      ) {
        event.preventDefault()
        console.warn('Extension error ignored:', event.message)
        return false
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('error', handleError)
      return () => window.removeEventListener('error', handleError)
    }
  }, [])

  return null
}
