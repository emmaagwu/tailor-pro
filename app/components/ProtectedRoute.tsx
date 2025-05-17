"use client"

import { useEffect } from "react"
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/") // redirect to home
    }
  }, [isLoggedIn, loading, router])

  if (loading) {
    return <div>Loading...</div> // You can replace this with a spinner or skeleton
  }

  if (!isLoggedIn) {
    return null // Don’t flash content while redirecting
  }

  return <>{children}</>
}
