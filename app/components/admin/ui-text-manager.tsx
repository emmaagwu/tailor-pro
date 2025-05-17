"use client"

import { useState } from "react"
import { useAdmin } from "@/app/context/admin-context"
import { Save, Eye, X, Check, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export default function UITextManager() {
  const { uiTexts, updateUIText } = useAdmin()
  const [editedTexts, setEditedTexts] = useState({ ...uiTexts })
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>("hero")

  // Text sections
  const sections = [
    { id: "hero", name: "Hero Section" },
    { id: "sections", name: "Product Sections" },
    { id: "showcase", name: "Showcase Section" },
    { id: "footer", name: "Footer & Marquee" },
  ]

  // Text fields by section
  const textFields: Record<string, { key: string; label: string; type: "input" | "textarea" }[]> = {
    hero: [
      { key: "heroTitle", label: "Hero Title", type: "input" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "input" },
    ],
    sections: [
      { key: "kaftanSectionTitle", label: "Kaftan Section Title", type: "input" },
      { key: "agbadaSectionTitle", label: "Agbada Section Title", type: "input" },
      { key: "suitSectionTitle", label: "Suit Section Title", type: "input" },
      { key: "shirtSectionTitle", label: "Shirt Section Title", type: "input" },
    ],
    showcase: [
      { key: "showcaseSectionTitle", label: "Showcase Title", type: "input" },
      { key: "showcaseSectionSubtitle", label: "Showcase Subtitle", type: "textarea" },
    ],
    footer: [
      { key: "footerText", label: "Footer Copyright Text", type: "input" },
      { key: "marqueeText", label: "Marquee Text", type: "textarea" },
    ],
  }

  // Handle text change
  const handleTextChange = (key: string, value: string) => {
    setEditedTexts({
      ...editedTexts,
      [key]: value,
    })
  }

  // Reset to original
  const resetToOriginal = (key: string) => {
    handleTextChange(key, uiTexts[key])
  }

  // Save changes
  const saveChanges = () => {
    // Update all texts
    Object.keys(editedTexts).forEach((key) => {
      updateUIText(key, editedTexts[key])
    })

    // Show success message
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  // Check if text has been modified
  const isModified = (key: string) => {
    return editedTexts[key] !== uiTexts[key]
  }

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-[#5D4037]">UI Text Editor</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center rounded-md border border-[#5D4037] px-4 py-2 text-[#5D4037] transition-colors hover:bg-[#5D4037]/5"
          >
            <Eye className="mr-2 h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={saveChanges}
            className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
          >
            <Save className="mr-2 h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {isSaved && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Changes saved successfully! The website texts have been updated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
                activeSection === section.id
                  ? "border-[#5D4037] text-[#5D4037]"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
              )}
            >
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Text Editor Fields */}
      <div className="space-y-6">
        {activeSection &&
          textFields[activeSection]?.map((field) => (
            <div key={field.key} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor={field.key} className="block font-medium text-gray-700">
                  {field.label}
                </label>
                {isModified(field.key) && (
                  <button
                    onClick={() => resetToOriginal(field.key)}
                    className="flex items-center rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                    title="Reset to original"
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {field.type === "textarea" ? (
                <textarea
                  id={field.key}
                  value={editedTexts[field.key] || ""}
                  onChange={(e) => handleTextChange(field.key, e.target.value)}
                  className={cn(
                    "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037] sm:text-sm",
                    isModified(field.key) && "border-amber-300 bg-amber-50",
                  )}
                  rows={3}
                />
              ) : (
                <input
                  type="text"
                  id={field.key}
                  value={editedTexts[field.key] || ""}
                  onChange={(e) => handleTextChange(field.key, e.target.value)}
                  className={cn(
                    "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037] sm:text-sm",
                    isModified(field.key) && "border-amber-300 bg-amber-50",
                  )}
                />
              )}

              <p className="mt-2 text-xs text-gray-500">
                Original: <span className="font-mono">{uiTexts[field.key]}</span>
              </p>
            </div>
          ))}
      </div>

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#5D4037]">Text Preview</h3>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Hero Section Preview */}
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-4 text-lg font-medium text-[#5D4037]">Hero Section</h4>
                <div className="relative rounded-lg bg-gray-100 p-8 text-center">
                  <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">{editedTexts.heroTitle}</h1>
                  <p className="text-gray-600">{editedTexts.heroSubtitle}</p>
                </div>
              </div>

              {/* Product Sections Preview */}
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-4 text-lg font-medium text-[#5D4037]">Product Sections</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-gray-100 p-4 text-center">
                    <h3 className="font-medium text-[#5D4037]">{editedTexts.kaftanSectionTitle}</h3>
                  </div>
                  <div className="rounded-lg bg-gray-100 p-4 text-center">
                    <h3 className="font-medium text-[#5D4037]">{editedTexts.agbadaSectionTitle}</h3>
                  </div>
                  <div className="rounded-lg bg-gray-100 p-4 text-center">
                    <h3 className="font-medium text-[#5D4037]">{editedTexts.suitSectionTitle}</h3>
                  </div>
                  <div className="rounded-lg bg-gray-100 p-4 text-center">
                    <h3 className="font-medium text-[#5D4037]">{editedTexts.shirtSectionTitle}</h3>
                  </div>
                </div>
              </div>

              {/* Showcase Section Preview */}
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-4 text-lg font-medium text-[#5D4037]">Showcase Section</h4>
                <div className="rounded-lg bg-gray-100 p-6 text-center">
                  <h2 className="mb-2 text-xl font-bold text-[#5D4037]">{editedTexts.showcaseSectionTitle}</h2>
                  <p className="text-gray-600">{editedTexts.showcaseSectionSubtitle}</p>
                </div>
              </div>

              {/* Footer & Marquee Preview */}
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-4 text-lg font-medium text-[#5D4037]">Footer & Marquee</h4>
                <div className="space-y-4">
                  <div className="rounded-lg bg-[#A1887F] p-3 text-center text-white">
                    <p className="text-sm">{editedTexts.marqueeText}</p>
                  </div>
                  <div className="rounded-lg bg-[#EFEAE6] p-3 text-center">
                    <p className="text-sm text-[#5D4037]">{editedTexts.footerText}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
