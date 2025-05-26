import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Format price to display as currency
export function formatPrice(price: number | string) {
  const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericPrice)
}

// Generate a unique code for products
export function generateProductCode(categoryPrefix: string) {
  const timestamp = Date.now().toString().slice(-4)
  const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${categoryPrefix.substring(0, 2).toUpperCase()}${timestamp}${randomChars}`
}


export const mapToImageObjects = (images?: string[]): { id: string; url: string; isMain: boolean }[] => {
  return (images || []).map((url, index) => ({
    id: `${index}`, // or generate a UUID if needed
    url,
    isMain: index === 0, // make first one main if you want
  }))
}
