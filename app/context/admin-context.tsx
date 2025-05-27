"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product, Category, NewProductInput, EditableProduct } from "@/lib/types"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/actions/product-actions"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/actions/category-actions"
import { getUITexts, updateUIText as updateUITextAction } from "@/lib/actions/ui-text-actions"
import {
  getCustomers,
  createCustomer,
  updateCustomer as updateCustomerAction,
  deleteCustomer as deleteCustomerAction,
} from "@/lib/actions/customer-actions"

// Define types for our context

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  measurements: Record<string, string>
  selectedWears: string[]
  notes: string
  createdAt: Date
}

interface AdminContextType {
  products: Product[]
  categories: Category[]
  featuredProducts: Record<string, string[]>
  uiTexts: Record<string, string>
  customers: Customer[]
  loading: {
    products: boolean
    categories: boolean
    uiTexts: boolean
    customers: boolean
  }
  error: {
    products: string | null
    categories: string | null
    uiTexts: string | null
    customers: string | null
  }
  refreshData: (dataType: "products" | "categories" | "uiTexts" | "customers" | "all") => Promise<void>
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt"> & {
      features?: string[]
      images?: string[]
    }
  ) => Promise<Product>
  // updateProduct: (product: Product & { features?: string[] }) => Promise<Product>
  updateProduct: (product: EditableProduct) => Promise<any>
  deleteProduct: (id: string) => Promise<void>
  addCategory: (category: { name: string; description?: string | null }) => Promise<Category>
  updateCategory: (category: Category) => Promise<Category>
  deleteCategory: (id: string) => Promise<void>
  setFeaturedProducts: (category: string, productIds: string[]) => Promise<void>
  updateUIText: (key: string, value: string) => Promise<void>
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => Promise<Customer>
  updateCustomer: (customer: Customer) => Promise<void>
  deleteCustomer: (id: string) => Promise<void>
}

// Create the context
const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Provider component
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Record<string, string[]>>({})
  const [uiTexts, setUITexts] = useState<Record<string, string>>({})
  const [customers, setCustomers] = useState<Customer[]>([])

  const [loading, setLoading] = useState({
    products: true,
    categories: true,
    uiTexts: true,
    customers: true,
  })

  const [error, setError] = useState({
    products: null as string | null,
    categories: null as string | null,
    uiTexts: null as string | null,
    customers: null as string | null,
  })

  // Load initial data
  useEffect(() => {
    loadProducts()
    loadCategories()
    loadUITexts()
    loadCustomers()
  }, [])

  // Load products
  const loadProducts = async () => {
    setLoading((prev) => ({ ...prev, products: true }))
    setError((prev) => ({ ...prev, products: null }))

    try {
      const rawData = await getProducts()
      // Safely transform the data to match your shared Productinterface
      const data = rawData.map((product: Product) => ({
        ...product,
        price: Number(product.price), // Convert Decimal to number
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      }))
      setProducts(data)
    } catch (err) {
      console.error("Failed to load products:", err)
      setError((prev) => ({ ...prev, products: "Failed to load products" }))
    } finally {
      setLoading((prev) => ({ ...prev, products: false }))
    }
  }

  // Load categories
  const loadCategories = async () => {
    setLoading((prev) => ({ ...prev, categories: true }))
    setError((prev) => ({ ...prev, categories: null }))

    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      console.error("Failed to load categories:", err)
      setError((prev) => ({ ...prev, categories: "Failed to load categories" }))
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }))
    }
  }

  // Load UI texts
  const loadUITexts = async () => {
    setLoading((prev) => ({ ...prev, uiTexts: true }))
    setError((prev) => ({ ...prev, uiTexts: null }))

    try {
      const data = await getUITexts()
      const textsObj = data.reduce(
        (acc, item) => {
          acc[item.key] = item.value
          return acc
        },
        {} as Record<string, string>,
      )
      setUITexts(textsObj)
    } catch (err) {
      console.error("Failed to load UI texts:", err)
      setError((prev) => ({ ...prev, uiTexts: "Failed to load UI texts" }))
    } finally {
      setLoading((prev) => ({ ...prev, uiTexts: false }))
    }
  }

  // Load customers
  const loadCustomers = async () => {
    setLoading((prev) => ({ ...prev, customers: true }))
    setError((prev) => ({ ...prev, customers: null }))

    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (err) {
      console.error("Failed to load customers:", err)
      setError((prev) => ({ ...prev, customers: "Failed to load customers" }))
    } finally {
      setLoading((prev) => ({ ...prev, customers: false }))
    }
  }

  // Refresh data
  const refreshData = async (dataType: "products" | "categories" | "uiTexts" | "customers" | "all") => {
    if (dataType === "products" || dataType === "all") {
      await loadProducts()
    }
    if (dataType === "categories" || dataType === "all") {
      await loadCategories()
    }
    if (dataType === "uiTexts" || dataType === "all") {
      await loadUITexts()
    }
    if (dataType === "customers" || dataType === "all") {
      await loadCustomers()
    }
  }

  // Add a new product
  const addProduct = async (
    product: Omit<Product, "id" | "createdAt" | "updatedAt" > & { features?: string[];
    images?: string[];
    },
  ) => {
    try {
      const newProduct = await createProduct(product)
      await refreshData("products")
      return newProduct
    } catch (err) {
      console.error("Failed to add product:", err)
      throw err
    }
  }

  // Update an existing product
  // const updateProductFn = async (product: Product & { features?: string[] }) => {
  //   try {
  //     const { id, ...data } = product
  //     const updatedProduct = await updateProduct(id, data)
  //     await refreshData("products")
  //     return updatedProduct
  //   } catch (err) {
  //     console.error("Failed to update product:", err)
  //     throw err
  //   }
  // }

  const updateProductFn = async (
    product: { id: string } & NewProductInput
  ): Promise<Product> => {
    try {
      const { id, ...data } = product
      const updatedProduct = await updateProduct(id, data)
      await refreshData("products")
      return updatedProduct
    } catch (err) {
      console.error("Failed to update product:", err)
      throw err
    }
  }

  // Delete a product
  const deleteProductFn = async (id: string) => {
    try {
      await deleteProduct(id)
      await refreshData("products")
    } catch (err) {
      console.error("Failed to delete product:", err)
      throw err
    }
  }

  // Add a new category
  const addCategory = async (category: { name: string; description?: string | null }) => {
    try {
      const newCategory = await createCategory(category)
      await refreshData("categories")
      return newCategory
    } catch (err) {
      console.error("Failed to add category:", err)
      throw err
    }
  }

  // Update an existing category
  const updateCategoryFn = async (category: Category) => {
    try {
      const { id, name, description } = category
      const updatedCategory = await updateCategory(id, { name, description })
      await refreshData("categories")
      return updatedCategory
    } catch (err) {
      console.error("Failed to update category:", err)
      throw err
    }
  }

  // Delete a category
  const deleteCategoryFn = async (id: string) => {
    try {
      await deleteCategory(id)
      await refreshData("categories")
    } catch (err) {
      console.error("Failed to delete category:", err)
      throw err
    }
  }

  // Set featured products for a category
  const setFeaturedProductsFn = async (category: string, productIds: string[]) => {
    try {
      // In a real application, you would save this to the database
      setFeaturedProducts((prev) => ({
        ...prev,
        [category]: productIds,
      }))
    } catch (err) {
      console.error("Failed to set featured products:", err)
      throw err
    }
  }

  // Update UI text
  const updateUITextFn = async (key: string, value: string) => {
    try {
      await updateUITextAction(key, value)
      setUITexts((prev) => ({
        ...prev,
        [key]: value,
      }))
    } catch (err) {
      console.error("Failed to update UI text:", err)
      throw err
    }
  }

  // Add a new customer
  const addCustomerFn = async (customer: Omit<Customer, "id" | "createdAt">) => {
    try {
      const newCustomer = await createCustomer(customer)
      await refreshData("customers")
      return newCustomer
    } catch (err) {
      console.error("Failed to add customer:", err)
      throw err
    }
  }

  // Update an existing customer
  const updateCustomerFn = async (customer: Customer) => {
    try {
      const { id, name, email, phone, measurements, selectedWears, notes } = customer
      await updateCustomerAction(id, { name, email, phone, measurements, selectedWears, notes })
      await refreshData("customers")
    } catch (err) {
      console.error("Failed to update customer:", err)
      throw err
    }
  }

  // Delete a customer
  const deleteCustomerFn = async (id: string) => {
    try {
      await deleteCustomerAction(id)
      await refreshData("customers")
    } catch (err) {
      console.error("Failed to delete customer:", err)
      throw err
    }
  }

  // Context value
  const value = {
    products,
    categories,
    featuredProducts,
    uiTexts,
    customers,
    loading,
    error,
    refreshData,
    addProduct,
    updateProduct: updateProductFn,
    deleteProduct: deleteProductFn,
    addCategory,
    updateCategory: updateCategoryFn,
    deleteCategory: deleteCategoryFn,
    setFeaturedProducts: setFeaturedProductsFn,
    updateUIText: updateUITextFn,
    addCustomer: addCustomerFn,
    updateCustomer: updateCustomerFn,
    deleteCustomer: deleteCustomerFn,
  }

  return <AdminContext.Provider value={value}>
    {children}</AdminContext.Provider>
}

// Custom hook to use the admin context
export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
