"use client"

import { useState } from "react"
import Image from "next/image"
import { useAdmin } from "@/app/context/admin-context"
import { Save, Eye, ArrowUp, ArrowDown, X, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/product"

export default function HomepageManager() {
  const { products, featuredProducts, setFeaturedProducts } = useAdmin()
  const [activeCategory, setActiveCategory] = useState("kaftan")
  const [selectedProducts, setSelectedProducts] = useState<Record<string, string[]>>(featuredProducts)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Get all products for the active category
  const categoryProducts = products.filter((product) => product.category === activeCategory)

  // Get the currently selected products for the active category
  const currentSelected = selectedProducts[activeCategory] || []

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    const isSelected = currentSelected.includes(productId)

    if (isSelected) {
      // Remove from selection
      const newSelected = currentSelected.filter((id) => id !== productId)
      setSelectedProducts({
        ...selectedProducts,
        [activeCategory]: newSelected,
      })
    } else {
      // Add to selection (max 4)
      if (currentSelected.length < 4) {
        const newSelected = [...currentSelected, productId]
        setSelectedProducts({
          ...selectedProducts,
          [activeCategory]: newSelected,
        })
      }
    }
  }

  // Move product up in the order
  const moveProductUp = (productId: string) => {
    const index = currentSelected.indexOf(productId)
    if (index > 0) {
      const newSelected = [...currentSelected]
      newSelected[index] = newSelected[index - 1]
      newSelected[index - 1] = productId
      setSelectedProducts({
        ...selectedProducts,
        [activeCategory]: newSelected,
      })
    }
  }

  // Move product down in the order
  const moveProductDown = (productId: string) => {
    const index = currentSelected.indexOf(productId)
    if (index < currentSelected.length - 1) {
      const newSelected = [...currentSelected]
      newSelected[index] = newSelected[index + 1]
      newSelected[index + 1] = productId
      setSelectedProducts({
        ...selectedProducts,
        [activeCategory]: newSelected,
      })
    }
  }

  // Save changes
  const saveChanges = () => {
    // Update all categories
    Object.keys(selectedProducts).forEach((category) => {
      setFeaturedProducts(category, selectedProducts[category])
    })

    // Show success message
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  // Get product details by ID
  const getProductById = (id: string): Product | undefined => {
    return products.find((product) => product.id === id)
  }

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-[#5D4037]">Homepage Control</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center rounded-md border border-[#5D4037] px-4 py-2 text-[#5D4037] transition-colors hover:bg-[#5D4037]/5"
          >
            <Eye className="mr-2 h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={saveChanges}
            className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
          >
            <Save className="mr-2 h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {isSaved && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Changes saved successfully! The homepage has been updated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {["kaftan", "agbada", "suit", "shirt"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium capitalize",
                activeCategory === category
                  ? "border-[#5D4037] text-[#5D4037]"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
              )}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      {/* Selected Products Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Selected Products ({currentSelected.length}/4)</h3>
          <span className="text-sm text-gray-500">Drag to reorder</span>
        </div>

        <div className="mb-8 space-y-3">
          {currentSelected.length === 0 ? (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <p className="text-gray-500">No products selected for this category</p>
            </div>
          ) : (
            currentSelected.map((productId, index) => {
              const product = getProductById(productId)
              if (!product) return null

              return (
                <div key={productId} className="flex items-center rounded-lg border border-gray-200 bg-white p-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">Code: {product.code}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveProductUp(productId)}
                      disabled={index === 0}
                      className={cn(
                        "rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600",
                        index === 0 && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveProductDown(productId)}
                      disabled={index === currentSelected.length - 1}
                      className={cn(
                        "rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600",
                        index === currentSelected.length - 1 && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleProductSelection(productId)}
                      className="rounded-full p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Available Products Section */}
      <div>
        <h3 className="mb-4 font-medium text-gray-900">Available Products</h3>

        {categoryProducts.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <div className="flex flex-col items-center">
              <AlertCircle className="mb-2 h-6 w-6 text-gray-400" />
              <p className="text-gray-500">No products found in this category</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product) => {
              const isSelected = currentSelected.includes(product.id)

              return (
                <div
                  key={product.id}
                  className={cn(
                    "flex items-center rounded-lg border p-3 transition-colors",
                    isSelected ? "border-[#5D4037] bg-[#5D4037]/5" : "border-gray-200 bg-white hover:border-gray-300",
                  )}
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">Code: {product.code}</p>
                  </div>
                  <button
                    onClick={() => toggleProductSelection(product.id)}
                    disabled={currentSelected.length >= 4 && !isSelected}
                    className={cn(
                      "ml-4 flex h-8 w-8 items-center justify-center rounded-full",
                      isSelected
                        ? "bg-[#5D4037] text-white hover:bg-[#5D4037]/90"
                        : currentSelected.length >= 4
                          ? "cursor-not-allowed bg-gray-100 text-gray-400"
                          : "border border-gray-300 bg-white text-gray-400 hover:border-[#5D4037] hover:text-[#5D4037]",
                    )}
                  >
                    {isSelected ? <Check className="h-4 w-4" /> : "+"}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#5D4037]">Homepage Preview</h3>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-8">
              {Object.keys(selectedProducts).map((category) => {
                const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1)
                const selectedIds = selectedProducts[category] || []
                const selectedCategoryProducts = selectedIds
                  .map((id) => getProductById(id))
                  .filter(Boolean) as Product[]

                return (
                  <div key={category} className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-4 text-lg font-medium capitalize text-[#5D4037]">{categoryTitle} Section</h4>

                    {selectedCategoryProducts.length === 0 ? (
                      <p className="text-center text-gray-500">No products selected</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {selectedCategoryProducts.map((product) => (
                          <div key={product.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                            <div className="relative aspect-[3/4] w-full bg-gray-100">
                              <Image
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, 25vw"
                              />
                            </div>
                            <div className="p-3">
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500">Code: {product.code}</p>
                              <p className="mt-1 font-bold text-[#5D4037]">${product.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
