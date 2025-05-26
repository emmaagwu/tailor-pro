import { type NextRequest, NextResponse } from "next/server"
import { uploadProductImage } from "@/lib/actions/product-actions"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const productId = formData.get("productId") as string
    const isMain = formData.get("isMain") === "true"

    if (!file || !productId) {
      return NextResponse.json({ error: "File and productId are required" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const result = await uploadProductImage(file, productId, isMain)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
