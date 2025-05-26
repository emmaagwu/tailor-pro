'use server'

import { revalidatePath } from "next/cache"
import { put, del } from "@vercel/blob"

import { prisma } from "@/lib/prisma/db"
import { serializeProduct, serializeProducts } from "@/lib/serializers/product"
// import { Decimal } from "@/lib/generated/prisma/runtime/library"
import { Decimal } from "@prisma/client/runtime/library"



// Get all products
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
        features: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })   
    const safeProducts = serializeProducts(products)
    return safeProducts
  } catch (error) {
    console.error("Failed to fetch products:", error)
    throw new Error("Failed to fetch products")
  }
}

// Get product by ID
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        features: true,
      },
    })
    return product
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error)
    throw new Error(`Failed to fetch product with ID ${id}`)
  }
}


export async function createProduct(data: {
  name: string
  code: string
  price: number
  description: string
  material?: string | null
  rating?: number
  categoryId: string
  features?: string[]
}) {
  try {
    const { features, ...productData } = data

    const product = await prisma.product.create({
      data: {
        ...productData,
        price: data.price, // Prisma handles Decimal conversion
        features: {
          create: features?.map((text) => ({ text })) || [],
        },
      },
      include: {
        category: true,
        images: true,
        features: true,
      },
    })

    revalidatePath("/admin/products")

    return serializeProduct(product)
  } catch (error) {
    console.error("Failed to create product:", error)
    throw new Error("Failed to create product")
  }
}


// Update a product
export async function updateProduct(
  id: string,
  data: {
    name: string
    code: string
    price: number
    description: string
    material?: string | null
    rating?: number
    categoryId: string
    features?: string[]
  },
) {
  try {
    const { features, ...productData } = data

    // First, delete existing features
    if (features) {
      await prisma.productFeature.deleteMany({
        where: { productId: id },
      })
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        features: features
          ? {
              create: features.map((text) => ({ text })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
        features: true,
      },
    })

    revalidatePath("/admin/products")
    return serializeProduct(product)
  } catch (error) {
    console.error(`Failed to update product with ID ${id}:`, error)
    throw new Error(`Failed to update product with ID ${id}`)
  }
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    // Get product images to delete from blob storage
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    })

    // Delete the product (cascade will delete related images and features)
    await prisma.product.delete({
      where: { id },
    })

    // Delete images from blob storage
    if (product?.images) {
      for (const image of product.images) {
        try {
          // Extract blob URL from the image URL
          const blobUrl = new URL(image.url)
          await del(blobUrl.toString())
        } catch (error) {
          console.error(`Failed to delete image blob for ${image.url}:`, error)
          // Continue with other deletions even if one fails
        }
      }
    }

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete product with ID ${id}:`, error)
    throw new Error(`Failed to delete product with ID ${id}`)
  }
}

// Upload product image
export async function uploadProductImage(
  file: File,
  productId: string,
  isMain = false,
): Promise<{ url: string; id: string }> {
  try {
    // Upload to Vercel Blob
    const filename = `${productId}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`.toLowerCase()
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    })

    // Save image reference in database
    const image = await prisma.productImage.create({
      data: {
        url: blob.url,
        isMain,
        productId,
      },
    })

    // If this is the main image, update other images to not be main
    if (isMain) {
      await prisma.productImage.updateMany({
        where: {
          productId,
          id: { not: image.id },
        },
        data: {
          isMain: false,
        },
      })
    }

    revalidatePath("/admin/products")
    return { url: blob.url, id: image.id }
  } catch (error) {
    console.error("Failed to upload product image:", error)
    throw new Error("Failed to upload product image")
  }
}

// Delete product image
export async function deleteProductImage(id: string) {
  try {
    // Get the image to delete
    const image = await prisma.productImage.findUnique({
      where: { id },
    })

    if (!image) {
      throw new Error("Image not found")
    }

    // Delete from database
    await prisma.productImage.delete({
      where: { id },
    })

    // Delete from blob storage
    try {
      const blobUrl = new URL(image.url)
      await del(blobUrl.toString())
    } catch (error) {
      console.error(`Failed to delete image blob for ${image.url}:`, error)
      // Continue even if blob deletion fails
    }

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete product image with ID ${id}:`, error)
    throw new Error(`Failed to delete product image with ID ${id}`)
  }
}

// Set main product image
export async function setMainProductImage(id: string, productId: string) {
  try {
    // Update the selected image to be main
    await prisma.productImage.update({
      where: { id },
      data: { isMain: true },
    })

    // Update all other images of this product to not be main
    await prisma.productImage.updateMany({
      where: {
        productId,
        id: { not: id },
      },
      data: {
        isMain: false,
      },
    })

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    console.error(`Failed to set main product image with ID ${id}:`, error)
    throw new Error(`Failed to set main product image with ID ${id}`)
  }
}

// Get featured products
export async function getFeaturedProducts() {
  try {
    // Get all categories
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    // For each category, get up to 4 products
    const featuredProducts: Record<string, string[]> = {}

    for (const category of categories) {
      const products = await prisma.product.findMany({
        where: {
          categoryId: category.id,
        },
        select: {
          id: true,
        },
        take: 4,
        orderBy: {
          createdAt: "desc",
        },
      })

      featuredProducts[category.id] = products.map((p) => p.id)
    }

    return featuredProducts
  } catch (error) {
    console.error("Failed to fetch featured products:", error)
    throw new Error("Failed to fetch featured products")
  }
}

// Update featured products
export async function updateFeaturedProducts(categoryId: string, productIds: string[]) {
  try {
    // Validate that all products exist and belong to the category
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        categoryId,
      },
      select: {
        id: true,
      },
    })

    if (products.length !== productIds.length) {
      throw new Error("Some products do not exist or do not belong to the specified category")
    }

    // In a real application, you would store this in a database table
    // For now, we'll just return success
    revalidatePath("/admin/homepage")
    return { success: true }
  } catch (error) {
    console.error(`Failed to update featured products for category ${categoryId}:`, error)
    throw new Error(`Failed to update featured products for category ${categoryId}`)
  }
}