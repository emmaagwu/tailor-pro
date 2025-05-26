'use server';

import { prisma } from '@/lib/prisma/db';
import { revalidatePath } from 'next/cache';

// Get all categories
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })
    return categories
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    throw new Error("Failed to fetch categories")
  }
}

// Get category by ID
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })
    return category
  } catch (error) {
    console.error(`Failed to fetch category with ID ${id}:`, error)
    throw new Error(`Failed to fetch category with ID ${id}`)
  }
}

// Create a new category
export async function createCategory(data: { name: string; description?: string | null }) {
  try {
    const category = await prisma.category.create({
      data,
    })
    revalidatePath("/admin/categories")
    revalidatePath("/admin/products")
    return category
  } catch (error) {
    console.error("Failed to create category:", error)
    throw new Error("Failed to create category")
  }
}

// Update a category
export async function updateCategory(id: string, data: { name: string; description?: string | null }) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data,
    })
    revalidatePath("/admin/categories")
    revalidatePath("/admin/products")
    return category
  } catch (error) {
    console.error(`Failed to update category with ID ${id}:`, error)
    throw new Error(`Failed to update category with ID ${id}`)
  }
}

// Delete a category
export async function deleteCategory(id: string) {
  try {
    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    if (category?._count?.products && category._count.products > 0) {
      throw new Error("Cannot delete category with products")
    }

    await prisma.category.delete({
      where: { id },
    })
    revalidatePath("/admin/categories")
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete category with ID ${id}:`, error)
    throw new Error(`Failed to delete category: ${(error as Error).message}`)
  }
}
