'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function NavigationProgress() {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    NProgress.configure({ 
      showSpinner: false,
      trickleSpeed: 200,
      minimum: 0.3,
    })

    const handleStart = () => {
      NProgress.start()
      setLoading(true)
    }
    
    const handleStop = () => {
      NProgress.done()
      setLoading(false)
    }

    // Simule le chargement lors du changement de route
    handleStart()
    const timer = setTimeout(handleStop, 300)

    return () => {
      clearTimeout(timer)
      handleStop()
    }
  }, [pathname])

  return null
}
