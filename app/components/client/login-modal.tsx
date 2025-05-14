// "use client"

// import { useState } from "react";

// const LoginModal = () => {


//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const handleAdminLogin = ()=>{
//     console.log("admin logged in")
//   }


//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
//           <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">Admin Login</h2>
//             <form onSubmit={handleAdminLogin}>
//               <input
//                 type="text"
//                 placeholder="Username"
//                 required
//                 className="w-full mb-3 rounded border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none"
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 required
//                 className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none"
//               />
//               <button
//                 type="submit"
//                 className="mt-4 w-full rounded bg-[#683D0D] px-4 py-2 text-white hover:bg-[#5D4037]"
//                 // className="mt-4 w-full rounded bg-[#5D4037] px-4 py-2 text-white hover:bg-[#4E342E]"
//               >
//                 Login
//               </button>
//             </form>

//             {/* <button
//               className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
//               aria-label="Close"
//               onClick={() => setShowLoginModal(false)}
//             >
//               <X className="h-4 w-4" />
//             </button> */}

//             <button
//               className="mt-4 w-full text-center text-sm text-red-500"
//               onClick={() => setShowLoginModal(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//   )
// }

// export default LoginModal



"use client"

import { X } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function LoginModal({ isOpen, onClose, onSubmit }: LoginModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Admin Login</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full mb-3 rounded border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded bg-[#683D0D] px-4 py-2 text-white hover:bg-[#5D4037]"
          >
            Login
          </button>
        </form>

        {/* <button
          className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button> */}

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