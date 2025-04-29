import { notFound } from "next/navigation"
import Navbar from "@/app/components/client/navbar"
import { Footer } from "@/app/components/client/footer"
import Marquee from "@/app/components/client/marquee"
import { WishlistProvider } from "@/app/context/wishlist-context"
import { getProductsByCategory, getCategories } from "@/lib/product"
import CategoryProductGrid from "@/app/components/client/category/category-product-grid"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params
  const products = getProductsByCategory(category)

  // Check if category exists
  if (products.length === 0) {
    notFound()
  }

  // Format category name for display
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <WishlistProvider>
      <Navbar />
      <Marquee
        text="FREE SHIPPING ON ALL ORDERS OVER $150 • NEW COLLECTION AVAILABLE NOW • USE CODE 'GRANDEUR10' FOR 10% OFF"
        speed="normal"
      />
      <main className="min-h-screen pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <h1 className="mb-8 text-center text-3xl font-bold text-[#5D4037] md:text-4xl">{categoryName} Collection</h1>
          <CategoryProductGrid products={products} />
        </div>
      </main>
      <Footer />
    </WishlistProvider>
  )
}

// Generate static params for all categories
export function generateStaticParams() {
  const categories = getCategories()
  return categories.map((category) => ({
    category,
  }))
}
