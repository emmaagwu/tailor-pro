import type React from "react"
import type { Metadata } from "next"
import { AdminProvider } from "@/app/context/admin-context"
import AdminSidebar from "@/app/components/admin/admin-sidebar"
import AdminHeader from "@/app/components/admin/admin-header"
import ProtectedRoute from "@/app/components/ProtectedRoute"

export const metadata: Metadata = {
  title: "Admin Dashboard | Grandeur Tailors",
  description: "Admin dashboard for Grandeur Tailors",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

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
