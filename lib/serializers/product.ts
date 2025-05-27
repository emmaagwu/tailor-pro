// lib/serializers/product.ts
import { Decimal } from "@/lib/generated/prisma/runtime/library"
import type { Product as PrismaProduct } from "@/lib/types" // adjust if needed




export function serializeProduct(product: PrismaProduct | any) {
  const clean = JSON.parse(JSON.stringify(product, (_key, value) => {
    if (value instanceof Decimal) {
      return Number(value)
    }
    if (value instanceof Date) {
      return value.toISOString()
    }
    return value
  }))
  return clean
}

export function serializeProducts(products: (PrismaProduct | any)[]) {
  return products.map(serializeProduct)
}
