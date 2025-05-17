"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useAdmin } from "@/app/context/admin-context"
import { Plus, Search, Edit, Trash2, Filter, ChevronDown, X, Upload, Check } from "lucide-react"
import type { Product } from "@/lib/product"

export default function ProductManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: "kaftan",
    rating: 4,
    images: ["/placeholder.svg"],
  })

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter ? product.category === categoryFilter : true

    return matchesSearch && matchesCategory
  })

  // Handle product edit
  const handleEditClick = (product: Product) => {
    setCurrentProduct(product)
    setIsEditModalOpen(true)
  }

  // Handle product delete
  const handleDeleteClick = (product: Product) => {
    setCurrentProduct(product)
    setIsDeleteModalOpen(true)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (currentProduct) {
      deleteProduct(currentProduct.id)
      setIsDeleteModalOpen(false)
      setCurrentProduct(null)
    }
  }

  // Handle add product
  const handleAddProduct = () => {
    // Generate a unique ID based on category and timestamp
    const category = newProduct.category || "product"
    const timestamp = Date.now().toString().slice(-4)
    const id = `${category.substring(0, 2)}${timestamp}`

    // Create the new product
    const productToAdd: Product = {
      id,
      name: newProduct.name || `New ${category}`,
      code: newProduct.code || `${category.toUpperCase()}-${timestamp}`,
      price: newProduct.price || 99.99,
      description: newProduct.description || `A new ${category} product`,
      material: newProduct.material || "Premium fabric",
      features: newProduct.features || ["Quality craftsmanship", "Custom fit"],
      images: newProduct.images || ["/placeholder.svg"],
      rating: newProduct.rating || 4,
      category: newProduct.category || "kaftan",
    }

    addProduct(productToAdd)
    setIsAddModalOpen(false)
    setNewProduct({
      category: "kaftan",
      rating: 4,
      images: ["/placeholder.svg"],
    })
  }

  // Handle update product
  const handleUpdateProduct = () => {
    if (currentProduct) {
      updateProduct(currentProduct)
      setIsEditModalOpen(false)
      setCurrentProduct(null)
    }
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
          <button
            onClick={() => setCategoryFilter(categoryFilter ? null : "kaftan")}
            className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037] sm:w-40"
          >
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-gray-400" />
              <span>{categoryFilter ? `Category: ${categoryFilter}` : "All Categories"}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {categoryFilter && (
            <button
              onClick={() => setCategoryFilter(null)}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
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
                src={product.images[0] || "/placeholder.svg"}
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
                  {product.category}
                </span>
              </div>
              <p className="mb-2 text-lg font-bold text-[#5D4037]">${product.price.toFixed(2)}</p>
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
            <ShoppingBagIcon className="mb-4 h-12 w-12 text-gray-400" />
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
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
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
                <label className="mb-1 block text-sm font-medium text-gray-700">Product Code</label>
                <input
                  type="text"
                  value={newProduct.code || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  placeholder="e.g. KF005"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={newProduct.category || "kaftan"}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                >
                  <option value="kaftan">Kaftan</option>
                  <option value="agbada">Agbada</option>
                  <option value="suit">Suit</option>
                  <option value="shirt">Shirt</option>
                </select>
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
                <label className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newProduct.images?.[0] || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    placeholder="Image URL"
                  />
                  <button className="flex items-center rounded-md bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200">
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">For demo purposes, use "/placeholder.svg" or any image URL</p>
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
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#5D4037]">Edit Product</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
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
                <label className="mb-1 block text-sm font-medium text-gray-700">Product Code</label>
                <input
                  type="text"
                  value={currentProduct.code}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, code: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={currentProduct.category}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                >
                  <option value="kaftan">Kaftan</option>
                  <option value="agbada">Agbada</option>
                  <option value="suit">Suit</option>
                  <option value="shirt">Shirt</option>
                </select>
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
                <label className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={currentProduct.images[0]}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        images: [e.target.value, ...currentProduct.images.slice(1)],
                      })
                    }
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  />
                  <button className="flex items-center rounded-md bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200">
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
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
                Are you sure you want to delete "{currentProduct.name}"? This action cannot be undone.
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

function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
