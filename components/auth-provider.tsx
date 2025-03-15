"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  role: "patient" | "insurer"
  email: string
} | null

type AuthContextType = {
  user: User
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse user from localStorage", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      // Redirect logic based on auth state and current path
      if (!user) {
        // If not logged in and trying to access protected routes
        if (pathname.startsWith("/patient") || pathname.startsWith("/insurer")) {
          router.push("/login")
        }
      } else {
        // If logged in but accessing wrong role's routes
        if (user.role === "patient" && pathname.startsWith("/insurer")) {
          router.push("/patient/dashboard")
        } else if (user.role === "insurer" && pathname.startsWith("/patient")) {
          router.push("/insurer/dashboard")
        }
      }
    }
  }, [user, loading, pathname, router])

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>
}

