import type { Product } from "@/lib/types"

export function getMainProductImage(product?: Product): string {
  return product?.images?.find((img) => img.isMain)?.url
    ?? product?.images?.[0]?.url
    ?? "/placeholder.svg"
}
