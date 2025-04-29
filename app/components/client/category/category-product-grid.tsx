"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useWishlist } from "@/app/context/wishlist-context"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/product"

interface CategoryProductGridProps {
  products: Product[]
}

export default function CategoryProductGrid({ products }: CategoryProductGridProps) {
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [isFavorite, setIsFavorite] = useState(isInWishlist(product.id))

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFavorite) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        code: product.code,
        price: product.price,
        imageUrl: product.images[0],
      })
    }
    setIsFavorite(!isFavorite)
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-md">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-[#5D4037]">{product.name}</h3>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm text-gray-500">Code: {product.code}</span>
            <span className="font-bold text-[#5D4037]">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </Link>

      {/* Wishlist Heart Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white"
        aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn("h-5 w-5 transition-colors", isFavorite ? "fill-[#5D4037] text-[#5D4037]" : "text-gray-400")}
        />
      </button>
    </div>
  )
}
