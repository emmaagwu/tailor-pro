"use client"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string, password: string) => void
}

export default function LoginModal({ isOpen, onClose, onSubmit }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password) // ✅ delegate to parent
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-3 rounded border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 pr-10 focus:border-[#5D4037] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded bg-[#683D0D] px-4 py-2 text-white hover:bg-[#5D4037]"
          >
            Login
          </button>
        </form>

        <button
          className="mt-4 w-full text-center text-sm text-red-500"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}