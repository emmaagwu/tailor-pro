import WearCard from "./wear-card"
import WearDetails from "./wear-details"
import { cn } from "@/lib/utils"

interface WearDisplayProps {
  imageUrl: string
  code: string
  price: number
  altText?: string
  className?: string
  onFavoriteToggle?: (isFavorite: boolean) => void
}

export default function WearDisplay({ imageUrl, code, price, altText, className, onFavoriteToggle }: WearDisplayProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <WearCard imageUrl={imageUrl} altText={altText} />
      <WearDetails code={code} price={price} onFavoriteToggle={onFavoriteToggle} />
    </div>
  )
}
