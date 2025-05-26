import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// This webhook can be used by external services to trigger revalidation
// For example, when a product is updated in the database
export async function POST(request: NextRequest) {
  try {
    const { path, token } = await request.json()

    // Validate webhook token (should match an environment variable)
    const webhookToken = process.env.WEBHOOK_TOKEN
    if (!webhookToken || token !== webhookToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 })
    }

    revalidatePath(path)
    return NextResponse.json({ revalidated: true, path })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}
