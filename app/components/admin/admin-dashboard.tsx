"use client"

import type React from "react"

import Link from "next/link"
import { useAdmin } from "@/app/context/admin-context"
import { ShoppingBag, Users, TrendingUp, Clock, LayoutGrid, Type, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
  const { products, customers } = useAdmin()

  // Calculate stats
  const totalProducts = products.length
  const totalCustomers = customers.length
  const pendingOrders = 5 // This would come from a real orders system
  const recentActivity = [
    { id: 1, type: "product", action: "added", item: "GT-Kaf 24/015", time: "2 hours ago" },
    { id: 2, type: "customer", action: "updated", item: "John Doe", time: "5 hours ago" },
    { id: 3, type: "homepage", action: "modified", item: "Featured Kaftans", time: "Yesterday" },
    { id: 4, type: "product", action: "deleted", item: "GT-Agb 24/011", time: "2 days ago" },
  ]

  // Quick action cards
  const quickActions = [
    {
      title: "Manage Products",
      description: "Add, edit or remove products",
      icon: <ShoppingBag className="h-6 w-6" />,
      href: "/admin/products",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Control Homepage",
      description: "Change featured products",
      icon: <LayoutGrid className="h-6 w-6" />,
      href: "/admin/homepage",
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Edit UI Texts",
      description: "Update website content",
      icon: <Type className="h-6 w-6" />,
      href: "/admin/ui-texts",
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Manage Customers",
      description: "View and edit customer data",
      icon: <Users className="h-6 w-6" />,
      href: "/admin/customers",
      color: "bg-emerald-50 text-emerald-700",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<ShoppingBag className="h-5 w-5" />}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={<Users className="h-5 w-5" />}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          icon={<Clock className="h-5 w-5" />}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Monthly Sales"
          value="₦250K"
          icon={<TrendingUp className="h-5 w-5" />}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[#5D4037]">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-full", action.color)}>
                {action.icon}
              </div>
              <h3 className="mb-1 font-medium text-gray-900">{action.title}</h3>
              <p className="mb-3 text-sm text-gray-500">{action.description}</p>
              <div className="mt-auto flex items-center text-sm font-medium text-[#5D4037]">
                <span>Go to section</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[#5D4037]">Recent Activity</h2>
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Activity</th>
                  <th className="px-6 py-3">Item</th>
                  <th className="px-6 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <ActivityIcon type={activity.type} />
                        <span className="ml-2 capitalize">{activity.action}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{activity.item}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{activity.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
}: { title: string; value: number | string; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", color)}>{icon}</div>
      </div>
    </div>
  )
}

// Activity Icon Component
function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "product":
      return <ShoppingBag className="h-4 w-4 text-blue-600" />
    case "customer":
      return <Users className="h-4 w-4 text-emerald-600" />
    case "homepage":
      return <LayoutGrid className="h-4 w-4 text-purple-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}
