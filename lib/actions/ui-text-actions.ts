"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma/db"
import type { UIText } from "@/lib/types"

// Get all UI texts
export async function getUITexts(): Promise<UIText[]> {
  try {
    const texts = await prisma.uIText.findMany()
    return texts.map((text) => ({
      key: text.key,
      value: text.value,
    }))
  } catch (error) {
    console.error("Failed to fetch UI texts:", error)
    throw new Error("Failed to fetch UI texts")
  }
}

// Update UI text
export async function updateUIText(key: string, value: string) {
  try {
    await prisma.uIText.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })

    revalidatePath("/admin/ui-texts")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(`Failed to update UI text with key ${key}:`, error)
    throw new Error(`Failed to update UI text with key ${key}`)
  }
}
