// Database model types that match the Prisma schema



export interface Admin {
  id: string
  email: string
  name: string | null
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  _count?: {
    products: number
  }
}

export interface Product {
  id: string
  name: string
  code: string
  price: number
  description: string
  material: string | null
  rating: number
  createdAt: Date
  updatedAt: Date
  categoryId: string
  category?: Category
  images?: ProductImage[]
  features?: ProductFeature[]
}

export type EditableProduct = {
  id?: string
  name?: string
  code?: string
  price?: number
  description?: string
  material?: string
  rating?: number
  categoryId?: string
  features?: string[]
  images?: string[] // or something else, depending on what you’re using
}

export interface ProductImage {
  id: string
  url: string
  isMain: boolean
  productId: string
  createdAt: Date
  updatedAt: Date
}

export interface ProductFeature {
  id: string
  text: string
  productId: string
  createdAt: Date
  updatedAt: Date
}

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

export interface UIText {
  key: string
  value: string
}
