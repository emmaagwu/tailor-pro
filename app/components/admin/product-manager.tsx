"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAdmin } from "@/app/context/admin-context"
import { Plus, Search, Edit, Trash2, ChevronDown, X, Check, AlertCircle } from "lucide-react"
import type { Product, NewProductInput, EditableProduct } from "@/lib/types"
import ImageUpload from "./image-upload"
import { formatPrice, generateProductCode } from "@/lib/utils"
import { mapToImageObjects } from "@/lib/utils"


export default function ProductManager() {
  const { products, categories, addProduct, updateProduct, deleteProduct, refreshData } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<EditableProduct | null>(null)
  const [, setProductToDelete] = useState<Product | null>(null)

  const [newProduct, setNewProduct] = useState<NewProductInput>({
    name: "",
    code: "",
    price: 99.99,
    description: "",
    material: "",
    rating: 4,
    categoryId: "",
    features: [],
  })
  const [featureInput, setFeatureInput] = useState("")
  const [currentFeatureInput, setCurrentFeatureInput] = useState("")

  // Reset new product form when categories change
  useEffect(() => {
    if (categories.length > 0 && !newProduct.categoryId) {
      setNewProduct((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }))
    }
  }, [categories, newProduct.categoryId])

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter ? product.categoryId === categoryFilter : true

    return matchesSearch && matchesCategory
  })

  // Handle product edit
  const handleEditClick = (product: Product) => {
    const editable: EditableProduct = {
      id: product.id,
      name: product.name,
      code: product.code,
      price: product.price,
      description: product.description,
      material: product.material ?? "",
      rating: product.rating,
      categoryId: product.categoryId,
      features: product.features?.map((f) => f.text) || [],
      images: product.images?.map((img) => img.url) || [],
    }

    setCurrentProduct(editable)
    setCurrentFeatureInput("")
    setIsEditModalOpen(true)
  }

  // Handle product delete
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (currentProduct?.id) {
      try {
        await deleteProduct(currentProduct.id)
        setIsDeleteModalOpen(false)
        setCurrentProduct(null)
      } catch (error) {
        console.error("Failed to delete product:", error)
        // Handle error (e.g., show error message)
      }
    }
  }

  // Add feature to new product
  const addFeature = () => {
    if (featureInput.trim()) {
      setNewProduct({
        ...newProduct,
        features: [...(newProduct.features || []), featureInput.trim()],
      })
      setFeatureInput("")
    }
  }

  // Remove feature from new product
  const removeFeature = (index: number) => {
    const updatedFeatures = [...(newProduct.features || [])]
    updatedFeatures.splice(index, 1)
    setNewProduct({
      ...newProduct,
      features: updatedFeatures,
    })
  }

  // Add feature to current product
  const addCurrentFeature = () => {
    if (currentFeatureInput.trim() && currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        features: [...(currentProduct.features || []), currentFeatureInput.trim()],
      })
      setCurrentFeatureInput("")
    }
  }

  // Remove feature from current product
  const removeCurrentFeature = (index: number) => {
    if (currentProduct) {
      const updatedFeatures = [...(currentProduct.features || [])]
      updatedFeatures.splice(index, 1)
      setCurrentProduct({
        ...currentProduct,
        features: updatedFeatures,
      })
    }
  }

  // Generate product code based on category
  const generateCode = () => {
    if (!newProduct.categoryId) return

    const category = categories.find((c) => c.id === newProduct.categoryId)
    if (category) {
      const prefix = category.name.substring(0, 2).toUpperCase()
      const code = generateProductCode(prefix)
      setNewProduct({
        ...newProduct,
        code,
      })
    }
  }

  // Handle add product
  // const handleAddProduct = async () => {
  //   try {
  //     await addProduct(newProduct as EditableProduct)
  //     setIsAddModalOpen(false)
  //     setNewProduct({
  //       name: "",
  //       code: "",
  //       price: 99.99,
  //       description: "",
  //       material: "",
  //       rating: 4,
  //       categoryId: categories[0]?.id || "",
  //       features: [],
  //     })
  //   } catch (error) {
  //     console.error("Failed to add product:", error)
  //     // Handle error (e.g., show error message)
  //   }
  // }

  const handleAddProduct = async () => {
    try {
      await addProduct(
        newProduct as Omit<Product, "id" | "createdAt" | "updatedAt"> & {
          features?: string[]
          images?: string[]
        }
      )
      setIsAddModalOpen(false)
      setNewProduct({
        name: "",
        code: "",
        price: 99.99,
        description: "",
        material: "",
        rating: 4,
        categoryId: categories[0]?.id || "",
        features: [],
        images: [],
      })
    } catch (error) {
      console.error("Failed to add product:", error)
      // Handle error (e.g., show error message)
    }
  }

  // Handle update product
  // const handleUpdateProduct = async () => {
  //   if (currentProduct) {
  //     try {
  //       await updateProduct(currentProduct as EditableProduct)
  //       setIsEditModalOpen(false)
  //       setCurrentProduct(null)
  //     } catch (error) {
  //       console.error("Failed to update product:", error)
  //       // Handle error (e.g., show error message)
  //     }
  //   }
  // }

  const handleUpdateProduct = async () => {
    if (currentProduct) {
      try {
        await updateProduct(currentProduct as { id: string } & NewProductInput)
        setIsEditModalOpen(false)
        setCurrentProduct(null)
      } catch (error) {
        console.error("Failed to update product:", error)
        // Handle error (e.g., show error message)
      }
    }
  }

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Unknown Category"
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Product Button */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-[#5D4037]">Product Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={categoryFilter || ""}
            onChange={(e) => setCategoryFilter(e.target.value || null)}
            className="w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-8 text-left text-sm focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037] sm:w-40"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
              <Image
                src={product.images?.[0]?.url || "/placeholder.svg?height=400&width=300"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">Code: {product.code}</p>
                </div>
                <span className="rounded-full bg-[#5D4037]/10 px-2 py-1 text-xs font-medium capitalize text-[#5D4037]">
                  {getCategoryName(product.categoryId)}
                </span>
              </div>
              <p className="mb-2 text-lg font-bold text-[#5D4037]">{formatPrice(product.price)}</p>
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">{product.description}</p>

              <div className="mt-auto flex space-x-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="flex flex-1 items-center justify-center rounded-md border border-[#5D4037] px-3 py-1.5 text-sm text-[#5D4037] transition-colors hover:bg-[#5D4037]/5"
                >
                  <Edit className="mr-1.5 h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(product)}
                  className="flex flex-1 items-center justify-center rounded-md border border-red-500 px-3 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-1 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mb-4 text-gray-500">
              {searchTerm || categoryFilter
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Get started by adding your first product."}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#5D4037]">Add New Product</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    placeholder="e.g. GT-Kaf 24/015"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newProduct.categoryId || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Product Code</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newProduct.code || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                      placeholder="e.g. KF005"
                    />
                    <button
                      onClick={generateCode}
                      className="whitespace-nowrap rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      type="button"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    placeholder="e.g. 129.99"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newProduct.description || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Material</label>
                <input
                  type="text"
                  value={newProduct.material || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  placeholder="e.g. Premium cotton blend"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
                <select
                  value={newProduct.rating || 0}
                  onChange={(e) => setNewProduct({ ...newProduct, rating: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                >
                  <option value="0">0 Stars</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Features</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    placeholder="Add a feature..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addFeature()
                      }
                    }}
                  />
                  <button
                    onClick={addFeature}
                    className="whitespace-nowrap rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    type="button"
                  >
                    Add
                  </button>
                </div>
                {newProduct.features && newProduct.features.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {newProduct.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                        <span className="text-sm">{feature}</span>
                        <button
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700"
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
                  disabled={!newProduct.name || !newProduct.code || !newProduct.categoryId}
                >
                  <Check className="mr-2 h-4 w-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && currentProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#5D4037]">Edit Product</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={currentProduct.categoryId}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, categoryId: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Product Code</label>
                  <input
                    type="text"
                    value={currentProduct.code}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, code: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number.parseFloat(e.target.value) })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Material</label>
                <input
                  type="text"
                  value={currentProduct.material || ""}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, material: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
                <select
                  value={currentProduct.rating}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, rating: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                >
                  <option value="0">0 Stars</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Features</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentFeatureInput}
                    onChange={(e) => setCurrentFeatureInput(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    placeholder="Add a feature..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addCurrentFeature()
                      }
                    }}
                  />
                  <button
                    onClick={addCurrentFeature}
                    className="whitespace-nowrap rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    type="button"
                  >
                    Add
                  </button>
                </div>
                {currentProduct.features && currentProduct.features.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {currentProduct.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                        <span className="text-sm">{feature}</span>
                        <button
                          onClick={() => removeCurrentFeature(index)}
                          className="text-red-500 hover:text-red-700"
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Images</label>
                { currentProduct?.id &&
                  <ImageUpload
                    productId={currentProduct.id}
                    existingImages={mapToImageObjects(currentProduct.images)}
                    onImageUploaded={() => refreshData("products")}
                  />
                }
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProduct}
                  className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
                  disabled={!currentProduct.name || !currentProduct.code || !currentProduct.categoryId}
                >
                  <Check className="mr-2 h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Product</h3>
              <p className="mt-2 text-gray-500">
                Are you sure you want to delete &quot;{currentProduct.name}&quot;? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
