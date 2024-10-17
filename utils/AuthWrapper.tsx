'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('mainStorage')
    if (!token) {
      router.push('/login')
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  if (!isLoggedIn) {
    return null // or a loading indicator
  }

  return <>{children}</>
}
