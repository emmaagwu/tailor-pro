"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface WearDetailsProps {
  code: string
  price: number
  className?: string
  onFavoriteToggle?: (isFavorite: boolean) => void
}

export default function WearDetails({ code, price, className, onFavoriteToggle }: WearDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavoriteClick = () => {
    const newState = !isFavorite
    setIsFavorite(newState)
    if (onFavoriteToggle) {
      onFavoriteToggle(newState)
    }
  }

  return (
    <div className={cn("mt-3 flex flex-col space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">Code: {code}</span>
        <button
          onClick={handleFavoriteClick}
          className="group flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isFavorite ? "fill-[#5D4037] text-[#5D4037]" : "text-gray-400 group-hover:text-[#5D4037]",
            )}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-[#5D4037]">${price.toFixed(2)}</span>
        <Link
          href={`/chat?product=${code}`}
          className="flex items-center space-x-1 text-sm font-medium text-[#A1887F] transition-colors hover:text-[#5D4037]"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Chat Tailor</span>
        </Link>
      </div>
    </div>
  )
}
