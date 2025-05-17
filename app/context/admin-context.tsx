"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/lib/product"
import { getAllProducts } from "@/lib/product"

// Define types for our context
interface AdminContextType {
  products: Product[]
  featuredProducts: Record<string, string[]>
  uiTexts: Record<string, string>
  customers: Customer[]
  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  setFeaturedProducts: (category: string, productIds: string[]) => void
  updateUIText: (key: string, value: string) => void
  addCustomer: (customer: Customer) => void
  updateCustomer: (customer: Customer) => void
  deleteCustomer: (id: string) => void
}

// Customer type
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  measurements: Record<string, string>
  selectedWears: string[]
  notes: string
  createdAt: string
}

// Default UI texts
const defaultUITexts = {
  heroTitle: "Elegance in Every Stitch",
  heroSubtitle: "Premium tailored clothing for all occasions",
  kaftanSectionTitle: "Premium Kaftans",
  agbadaSectionTitle: "Luxury Agbada",
  suitSectionTitle: "Tailored Suits",
  shirtSectionTitle: "Premium Shirts",
  showcaseSectionTitle: "Crafting Elegance and style",
  showcaseSectionSubtitle:
    "We set a high production standard that is constantly focused on our customers' satisfaction.",
  footerText: "Grandeur Tailors ©2024 All Rights Reserved",
  marqueeText:
    "FREE SHIPPING ON ALL ORDERS OVER $150 • NEW COLLECTION AVAILABLE NOW • USE CODE 'GRANDEUR10' FOR 10% OFF",
}

// Create the context
const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Provider component
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProductsState] = useState<Record<string, string[]>>({
    kaftan: [],
    agbada: [],
    suit: [],
    shirt: [],
  })
  const [uiTexts, setUITexts] = useState<Record<string, string>>(defaultUITexts)
  const [customers, setCustomers] = useState<Customer[]>([])

  // Load initial data
  useEffect(() => {
    // Load products
    const allProducts = getAllProducts()
    setProducts(allProducts)

    // Set initial featured products (first 4 of each category)
    const featured: Record<string, string[]> = {}
    const categories = ["kaftan", "agbada", "suit", "shirt"]

    categories.forEach((category) => {
      const categoryProducts = allProducts.filter((p) => p.category === category)
      featured[category] = categoryProducts.slice(0, 4).map((p) => p.id)
    })

    setFeaturedProductsState(featured)

    // Load customers (would come from API in real app)
    const sampleCustomers: Customer[] = [
      {
        id: "cust001",
        name: "John Doe",
        email: "john@example.com",
        phone: "+2347012345678",
        measurements: {
          chest: "42",
          waist: "36",
          shoulder: "18",
          sleeve: "25",
          neck: "16",
        },
        selectedWears: ["kf001", "st002"],
        notes: "Prefers slim fit designs",
        createdAt: "2024-01-15",
      },
      {
        id: "cust002",
        name: "Michael Johnson",
        email: "michael@example.com",
        phone: "+2348023456789",
        measurements: {
          chest: "44",
          waist: "38",
          shoulder: "19",
          sleeve: "26",
          neck: "17",
        },
        selectedWears: ["ag001"],
        notes: "Likes traditional designs with modern touches",
        createdAt: "2024-02-20",
      },
    ]

    setCustomers(sampleCustomers)
  }, [])

  // Add a new product
  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product])
  }

  // Update an existing product
  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)))
  }

  // Delete a product
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))

    // Also remove from featured products if present
    Object.keys(featuredProducts).forEach((category) => {
      if (featuredProducts[category].includes(id)) {
        setFeaturedProducts(
          category,
          featuredProducts[category].filter((pid) => pid !== id),
        )
      }
    })
  }

  // Set featured products for a category
  const setFeaturedProducts = (category: string, productIds: string[]) => {
    setFeaturedProductsState((prev) => ({
      ...prev,
      [category]: productIds,
    }))
  }

  // Update UI text
  const updateUIText = (key: string, value: string) => {
    setUITexts((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Add a new customer
  const addCustomer = (customer: Customer) => {
    setCustomers((prev) => [...prev, customer])
  }

  // Update an existing customer
  const updateCustomer = (customer: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === customer.id ? customer : c)))
  }

  // Delete a customer
  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }

  // Context value
  const value = {
    products,
    featuredProducts,
    uiTexts,
    customers,
    addProduct,
    updateProduct,
    deleteProduct,
    setFeaturedProducts,
    updateUIText,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

// Custom hook to use the admin context
export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
