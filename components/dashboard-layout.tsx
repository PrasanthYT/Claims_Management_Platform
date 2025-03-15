"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Home, LogOut, User } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(true)

  if (!user) {
    return null
  }

  const isPatient = user.role === "patient"
  const baseUrl = isPatient ? "/patient" : "/insurer"

  const menuItems = isPatient
    ? [
        { title: "Dashboard", icon: Home, path: `${baseUrl}/dashboard` },
        { title: "Submit Claim", icon: FileText, path: `${baseUrl}/submit-claim` },
        { title: "My Claims", icon: FileText, path: `${baseUrl}/claims` },
      ]
    : [
        { title: "Dashboard", icon: Home, path: `${baseUrl}/dashboard` },
        { title: "All Claims", icon: FileText, path: `${baseUrl}/claims` },
      ]

  return (
    <SidebarProvider defaultOpen={open} onOpenChange={setOpen}>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-xl">ClaimEase</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={pathname === item.path}>
                    <Link href={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{isPatient ? "Patient Portal" : "Insurer Portal"}</h1>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

