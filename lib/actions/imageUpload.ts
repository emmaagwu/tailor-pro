'use server'

import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma/db';

// Upload image from URL
export async function uploadImageFromUrl(url: string, productId: string, isMain: boolean = false) {
  try {
    // Fetch the image from URL
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const blob = await response.blob();
    const fileName = `product-${productId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const contentType = blob.type || 'image/jpeg';
    
    // Upload to Vercel Blob
    const uploadedBlob = await put(fileName, blob, {
      contentType,
      access: 'public',
    });
    
    // Save to database
    const image = await prisma.productImage.create({
      data: {
        url: uploadedBlob.url,
        productId,
        isMain,
      },
    });
    
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');
    
    return image;
  } catch (error) {
    console.error('Error uploading image from URL:', error);
    throw new Error('Failed to upload image from URL');
  }
}

// Upload image from file
export async function uploadImageFromFile(formData: FormData, productId: string, isMain: boolean = false) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');
    
    const fileName = `product-${productId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Upload to Vercel Blob
    const uploadedBlob = await put(fileName, file, {
      contentType: file.type,
      access: 'public',
    });
    
    // Save to database
    const image = await prisma.productImage.create({
      data: {
        url: uploadedBlob.url,
        productId,
        isMain,
      },
    });
    
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');
    
    return image;
  } catch (error) {
    console.error('Error uploading image file:', error);
    throw new Error('Failed to upload image file');
  }
}

// Delete image
export async function deleteImage(imageId: string) {
  try {
    // Get image URL from database
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    });
    
    if (!image) throw new Error('Image not found');
    
    // Extract the blob path from the URL
    const url = new URL(image.url);
    const blobPath = url.pathname.substring(1); // Remove leading slash
    
    // Delete from Vercel Blob
    await del(blobPath);
    
    // Delete from database
    await prisma.productImage.delete({
      where: { id: imageId },
    });
    
    revalidatePath(`/products/${image.productId}`);
    revalidatePath('/products');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}