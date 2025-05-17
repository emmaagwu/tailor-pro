import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AdminProvider } from "@/app/context/admin-context"
import AdminSidebar from "@/app/components/admin/admin-sidebar"
import AdminHeader from "@/app/components/admin/admin-header"
import ProtectedRoute from "@/app/components/ProtectedRoute"

export const metadata: Metadata = {
  title: "Admin Dashboard | Grandeur Tailors",
  description: "Admin dashboard for Grandeur Tailors",
}

// // This is a simple auth check - in a real app, you would use a proper auth system
// function checkAuth() {
//   // For demo purposes, we're just returning true
//   // In a real app, you would check if the user is authenticated
//   return true
// }

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const isAuthenticated = checkAuth()

  // if (!isAuthenticated) {
  //   redirect("/admin/login")
  // }

  return (
    <ProtectedRoute>
      <AdminProvider>
        <div className="flex min-h-screen flex-col bg-[#FAF7F2] md:flex-row">
          <AdminSidebar />
          <div className="flex-1">
            <AdminHeader />
            <main className="p-4 md:p-6">{children}</main>
          </div>
        </div>
      </AdminProvider>
    </ProtectedRoute>
  )
}
