"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, LayoutGrid, Type, Users, Menu, X, Tags } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Categories", href: "/admin/categories", icon: <Tags className="h-5 w-5" /> },
    { name: "Products", href: "/admin/products", icon: <ShoppingBag className="h-5 w-5" /> },
    { name: "Homepage", href: "/admin/homepage", icon: <LayoutGrid className="h-5 w-5" /> },
    { name: "UI Texts", href: "/admin/ui-texts", icon: <Type className="h-5 w-5" /> },
    { name: "Customers", href: "/admin/customers", icon: <Users className="h-5 w-5" /> },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Mobile menu button - fixed at the bottom left
  const mobileMenuButton = (
    <button
      onClick={toggleMobileMenu}
      className="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#5D4037] text-white shadow-lg md:hidden"
      aria-label="Toggle menu"
    >
      {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 bg-[#5D4037] text-white md:block">
        <div className="p-6">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold">Grandeur Admin</span>
          </Link>
        </div>
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-4 py-3 transition-colors",
                    pathname === item.href
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar (Slide-in) */}
      <div
        className={cn(
          "fixed inset-0 z-40 transform bg-black/50 transition-opacity duration-300 md:hidden",
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={toggleMobileMenu}
      />

      <aside
        className={cn(
          "fixed bottom-0 left-0 z-40 h-[80vh] w-64 transform overflow-y-auto bg-[#5D4037] text-white transition-transform duration-300 md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold">Grandeur Admin</span>
          </Link>
        </div>
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-4 py-3 transition-colors",
                    pathname === item.href
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {mobileMenuButton}
    </>
  )
}
