"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface WearGridProps {
  children: React.ReactNode
  className?: string
}

export default function WearGrid({ children, className }: WearGridProps) {
  return (
    <div className={cn("relative w-full py-6", className)}>
      {/* Horizontal scrollable container */}
      <div className="flex w-full overflow-x-auto pb-4 snap-x">
        <div className="flex space-x-3 sm:space-x-4 md:space-x-4 lg:space-x-3 mx-auto w-full lg:w-[99%]">
          {React.Children.map(children, (child) => (
            <div className="flex-shrink-0 snap-start w-[75%] sm:w-[42%] md:w-[31%] lg:w-[24.25%]">{child}</div>
          ))}
        </div>
      </div>

      {/* Scroll indicators */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 block">
        <div className="h-12 w-8 bg-gradient-to-l from-white to-transparent opacity-80"></div>
      </div>

      {/* Scoped styles for scrollbar hiding */}
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .overflow-x-auto {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  )
}
