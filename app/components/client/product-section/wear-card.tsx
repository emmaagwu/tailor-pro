"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface WearCardProps {
  imageUrl: string
  altText?: string
  className?: string
}

export default function WearCard({ imageUrl, altText = "Fashion item", className }: WearCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg transition-all duration-300",
        isHovered ? "scale-95" : "scale-100",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={altText}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    </div>
  )
}
