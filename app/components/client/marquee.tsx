"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps {
  text: string
  speed?: "slow" | "normal" | "fast"
  className?: string
  backgroundColor?: string
  textColor?: string
  repeat?: number
}

export default function Marquee({
  text,
  speed = "normal",
  className,
  backgroundColor = "#683D0D", // Light brown default
  textColor = "white",
  repeat = 3,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)

  // Set animation duration based on speed prop
  const speedMap = {
    slow: "40s",
    normal: "35s",
    fast: "15s",
  }

  // Create repeated text with proper spacing
  const repeatedText = Array(repeat)
    .fill(text)
    .map((item, index) => (
      <span key={index} className="inline-block px-40">
        {item}
      </span>
    ))

  // Measure content width for animation
  useEffect(() => {
    if (containerRef.current) {
      setContentWidth(containerRef.current.scrollWidth)
    }
  }, [text])

  return (
    <div className={cn("overflow-hidden whitespace-nowrap py-4 font-medium", className)} style={{ backgroundColor }}>
      <div
        ref={containerRef}
        className="inline-block"
        style={{
          color: textColor,
          animation: `marquee ${speedMap[speed]} linear infinite`,
          whiteSpace: "nowrap",
        }}
      >
        {repeatedText}
      </div>

      {/* Scoped styles for the marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  )
}
