"use client"

import { useState } from "react"
import { useAdmin } from "@/app/context/admin-context"
import { Plus, Edit, Trash2, X, Check, AlertCircle } from "lucide-react"
import type { Category } from "@/lib/types"

export default function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    description: "",
  })



  // Handle category edit
  const handleEditClick = (category: Category) => {
    setCurrentCategory(category)
    setIsEditModalOpen(true)
  }

  // Handle category delete
  const handleDeleteClick = (category: Category) => {
    setCurrentCategory(category)
    setIsDeleteModalOpen(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (currentCategory) {
      try {
        await deleteCategory(currentCategory.id)
        setIsDeleteModalOpen(false)
        setCurrentCategory(null)
      } catch (error) {
        console.error("Failed to delete category:", error)
        // Handle error (e.g., show error message)
      }
    }
  }

  // Handle add category
  const handleAddCategory = async () => {
    try {
      await addCategory({
        name: newCategory.name || "",
        description: newCategory.description || "",
      })
      setIsAddModalOpen(false)
      setNewCategory({
        name: "",
        description: "",
      })
    } catch (error) {
      console.error("Failed to add category:", error)
      // Handle error (e.g., show error message)
    }
  }

  // Handle update category
  const handleUpdateCategory = async () => {
    if (currentCategory) {
      try {
        await updateCategory(currentCategory)
        setIsEditModalOpen(false)
        setCurrentCategory(null)
      } catch (error) {
        console.error("Failed to update category:", error)
        // Handle error (e.g., show error message)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Category Button */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-[#5D4037]">Category Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-medium text-gray-900">{category.name}</h3>
              </div>
              <p className="mb-4 text-sm text-gray-600">{category.description || "No description"}</p>
              <p className="mb-2 text-xs text-gray-500">
                Products: <span className="font-medium">{category._count?.products || 0}</span>
              </p>

              <div className="mt-auto flex space-x-2">
                <button
                  onClick={() => handleEditClick(category)}
                  className="flex flex-1 items-center justify-center rounded-md border border-[#5D4037] px-3 py-1.5 text-sm text-[#5D4037] transition-colors hover:bg-[#5D4037]/5"
                >
                  <Edit className="mr-1.5 h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(category)}
                  className="flex flex-1 items-center justify-center rounded-md border border-red-500 px-3 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                  disabled={(category._count?.products ?? 0) > 0}
                  title={
                    (category._count?.products ?? 0) > 0
                      ? "Cannot delete category with products"
                      : "Delete category"
                  }
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-1 text-lg font-medium text-gray-900">No categories found</h3>
            <p className="mb-4 text-gray-500">Get started by adding your first category.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Category</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#5D4037]">Add New Category</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  value={newCategory.name || ""}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  placeholder="e.g. Kaftan"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newCategory.description || ""}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  placeholder="Category description..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
                  disabled={!newCategory.name}
                >
                  <Check className="mr-2 h-4 w-4" />
                  <span>Add Category</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && currentCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#5D4037]">Edit Category</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={currentCategory.description || ""}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCategory}
                  className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
                  disabled={!currentCategory.name}
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
      {isDeleteModalOpen && currentCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Category</h3>
              <p className="mt-2 text-gray-500">
                Are you sure you want to delete &quot;{currentCategory.name}&quot;? This action cannot be undone.
              </p>
              {currentCategory._count?.products && currentCategory._count.products > 0 && (
                <p className="mt-2 text-sm text-red-500">
                  This category has {currentCategory._count.products} products. Please reassign or delete these products
                  first.
                </p>
              )}
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
                disabled={(currentCategory._count?.products ?? 0) > 0}
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
