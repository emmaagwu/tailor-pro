"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ShowcaseScrollProps {
  children: React.ReactNode
  className?: string
  speed?: "slow" | "normal" | "fast"
  reverse?: boolean
}

export default function ShowcaseScroll({
  children,
  className,
  speed = "normal",
  reverse = false,
}: ShowcaseScrollProps) {
  // Set animation duration based on speed prop
  const speedMap = {
    slow: "80s",
    normal: "50s",
    fast: "30s",
  }

  // Clone children for seamless scrolling
  const childrenArray = React.Children.toArray(children)

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="flex w-full">
        {/* First set of items */}
        <div
          className="flex min-w-full shrink-0 animate-scroll space-x-3 sm:space-x-4 md:space-x-4 lg:space-x-3"
          style={{
            animationDuration: speedMap[speed],
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {childrenArray.map((child, index) => (
            <div key={`first-${index}`} className="flex-shrink-0 w-[75%] sm:w-[42%] md:w-[31%] lg:w-[24.25%]">
              {child}
            </div>
          ))}
        </div>

        {/* Duplicate set for seamless scrolling */}
        <div
          className="flex min-w-full shrink-0 animate-scroll space-x-3 sm:space-x-4 md:space-x-4 lg:space-x-3"
          style={{
            animationDuration: speedMap[speed],
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {childrenArray.map((child, index) => (
            <div key={`second-${index}`} className="flex-shrink-0 w-[75%] sm:w-[42%] md:w-[31%] lg:w-[24.25%]">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Scoped styles for the continuous scroll animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll {
          animation-name: scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;
          will-change: transform;
        }
      `}</style>
    </div>
  )
}
