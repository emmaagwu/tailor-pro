// // Database model types that match the Prisma schema



// export interface Admin {
//   id: string
//   email: string
//   name: string | null
//   createdAt: Date
// }

// export interface Category {
//   id: string
//   name: string
//   description: string | null
//   createdAt: Date
//   updatedAt: Date
//   _count?: {
//     products: number
//   }
// }

// export interface Product {
//   id: string
//   name: string
//   code: string
//   price: number
//   description: string
//   material: string | null
//   rating: number
//   createdAt: Date
//   updatedAt: Date
//   categoryId: string
//   category?: Category
//   images?: ProductImage[]
//   features?: ProductFeature[]
// }

// export type EditableProduct = { id: string } & NewProductInput


// export type NewProductInput = Omit<
//   Product,
//   "id" | "createdAt" | "updatedAt" | "features" | "images"
// > & {
//   features?: string[]
//   images?: string[]
// }


// export interface ProductImage {
//   id: string
//   url: string
//   isMain: boolean
//   productId: string
//   createdAt: Date
//   updatedAt: Date
// }

// export interface ProductFeature {
//   id: string
//   text: string
//   productId: string
//   createdAt: Date
//   updatedAt: Date
// }

// export interface Customer {
//   id: string
//   name: string
//   email: string
//   phone: string
//   measurements: Record<string, string>
//   selectedWears: string[]
//   notes: string
//   createdAt: Date
// }

// export interface UIText {
//   key: string
//   value: string
// }


// Import Prisma-generated types
import type {
  Admin as PrismaAdmin,
  Category as PrismaCategory,
  Product as PrismaProduct,
  ProductImage as PrismaProductImage,
  ProductFeature as PrismaProductFeature,
  Customer as PrismaCustomer,
  UIText as PrismaUIText,
  Prisma
} from "@prisma/client"

// Re-export Prisma types that don't need modification
export type Admin = PrismaAdmin
export type ProductImage = PrismaProductImage
export type ProductFeature = PrismaProductFeature
export type UIText = PrismaUIText

// Custom types that extend or modify Prisma types
export interface Category extends PrismaCategory {
  _count?: {
    products: number
  }
}

export interface Product extends Omit<PrismaProduct, 'price'> {
  price: number // Convert Decimal to number
  category?: Category
  images?: ProductImage[]
  features?: ProductFeature[]
}

// Customer with measurements as Record<string, string> instead of JsonValue
export interface Customer extends Omit<PrismaCustomer, 'measurements'> {
  measurements: Record<string, string>
}

// Your existing custom types
export type EditableProduct = { id: string } & NewProductInput

export type NewProductInput = Omit<
  Product,
  "id" | "createdAt" | "updatedAt" | "features" | "images"
> & {
  features?: string[]
  images?: string[]
}

// Utility functions for data transformation
export function transformCustomer(prismaCustomer: PrismaCustomer): Customer {
  return {
    ...prismaCustomer,
    measurements: (prismaCustomer.measurements as Record<string, string>) || {}
  }
}

export function transformCustomerForPrisma(
  customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
): Omit<PrismaCustomer, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    ...customer,
    measurements: customer.measurements as any // JsonValue
  }
}

export function transformProduct(prismaProduct: PrismaProduct): Product {
  return {
    ...prismaProduct,
    price: Number(prismaProduct.price) // Convert Decimal to number
  }
}

export function transformProductForPrisma(
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Omit<PrismaProduct, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    ...product,
    price: product.price as unknown as Prisma.Decimal, // Will be converted to Decimal by Prisma
  }
}

// Type for Product with relations (useful for queries with include)
export type ProductWithRelations = Product & {
  category: Category
  images: ProductImage[]
  features: ProductFeature[]
}

// Type for Category with relations
export type CategoryWithCount = Category & {
  _count: {
    products: number
  }
}
