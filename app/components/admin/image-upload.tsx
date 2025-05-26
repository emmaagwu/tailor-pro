"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Star, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { uploadProductImage, deleteProductImage, setMainProductImage } from "@/lib/actions/product-actions"

interface ImageUploadProps {
  productId: string
  existingImages?: Array<{
    id: string
    url: string
    isMain: boolean
  }>
  onImageUploaded?: () => void
}

export default function ImageUpload({ productId, existingImages = [], onImageUploaded }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 300)

      // Upload the file
      const file = files[0]
      const isMain = existingImages.length === 0 // Make it main if it's the first image
      await uploadProductImage(file, productId, isMain)

      // Complete the progress
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Notify parent component
      if (onImageUploaded) {
        onImageUploaded()
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.")
      console.error("Upload error:", err)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteProductImage(imageId)
      if (onImageUploaded) {
        onImageUploaded()
      }
    } catch (err) {
      setError("Failed to delete image. Please try again.")
      console.error("Delete error:", err)
    }
  }

  const handleSetMainImage = async (imageId: string) => {
    try {
      await setMainProductImage(imageId, productId)
      if (onImageUploaded) {
        onImageUploaded()
      }
    } catch (err) {
      setError("Failed to set main image. Please try again.")
      console.error("Set main image error:", err)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center justify-center">
        <label
          htmlFor="image-upload"
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100",
            isUploading && "opacity-50 cursor-not-allowed",
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-[#5D4037]" />
              <span className="text-sm text-gray-500">Uploading... {uploadProgress}%</span>
              <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-[#5D4037] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <Upload className="mb-2 h-8 w-8 text-gray-400" />
              <p className="mb-1 text-sm font-medium text-gray-700">Click to upload an image</p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
            </>
          )}
          <input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="mb-2 font-medium text-gray-700">Product Images</h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {existingImages.map((image) => (
              <div key={image.id} className="relative rounded-lg border border-gray-200 bg-white p-2">
                <div className="relative aspect-square w-full overflow-hidden rounded-md">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt="Product image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <button
                    onClick={() => handleSetMainImage(image.id)}
                    className={cn(
                      "rounded-full p-1 transition-colors",
                      image.isMain ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500",
                    )}
                    title={image.isMain ? "Main image" : "Set as main image"}
                    disabled={image.isMain}
                  >
                    <Star className="h-5 w-5" fill={image.isMain ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="rounded-full p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Delete image"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
