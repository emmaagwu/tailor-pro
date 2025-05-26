"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, User, LogOut, ExternalLink } from "lucide-react"


export default function AdminHeader() {
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Get the current page title based on the pathname
  const getPageTitle = () => {
    const path = pathname.split("/").pop()

    switch (path) {
      case "admin":
        return "Dashboard"
      case "categories":
        return "Category Management"
      case "products":
        return "Product Management"
      case "homepage":
        return "Homepage Control"
      case "ui-texts":
        return "UI Text Editor"
      case "customers":
        return "Customer Management"
      default:
        return "Admin Dashboard"
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Page Title */}
        <h1 className="text-lg font-bold text-[#5D4037] md:text-xl">{getPageTitle()}</h1>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* View Site Button */}
          <Link
            href="/"
            target="_blank"
            className="hidden items-center rounded-md border border-[#5D4037] px-3 py-1.5 text-sm text-[#5D4037] transition-colors hover:bg-[#5D4037]/5 md:flex"
          >
            <ExternalLink className="mr-1.5 h-4 w-4" />
            <span>View Site</span>
          </Link>

          {/* Notifications */}
          <button className="relative rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center rounded-full text-sm focus:outline-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8D6E63] text-white">
                <User className="h-5 w-5" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <Link
                  href="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Settings
                </Link>
                <div className="my-1 h-px bg-gray-200"></div>
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <div className="flex items-center text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
