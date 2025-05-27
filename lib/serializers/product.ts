// lib/serializers/product.ts
import { Decimal } from "@/lib/generated/prisma/runtime/library"
// import type { Product  } from "@/lib/types" // adjust if needed



// export function serializeProduct(product: Product) {
//   const clean = JSON.parse(JSON.stringify(product, (_key, value) => {
//     if (value instanceof Decimal) {
//       return Number(value)
//     }
//     if (value instanceof Date) {
//       return value.toISOString()
//     }
//     return value
//   }))
//   return clean
// }

// export function serializeProducts(products: Product[]) {
//   return products.map(serializeProduct)
// }

import { Prisma } from "@/lib/generated/prisma";

export function serializeProduct(
  product: Prisma.ProductGetPayload<{
    include: { category: true; features: true; images: true };
  }>
) {
  const clean = JSON.parse(JSON.stringify(product, (_key, value) => {
    if (value instanceof Decimal) {
      return Number(value);
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }));
  return clean;
}

export function serializeProducts(
  products: Prisma.ProductGetPayload<{
    include: { category: true; features: true; images: true };
  }>[]
) {
  return products.map(serializeProduct);
}
