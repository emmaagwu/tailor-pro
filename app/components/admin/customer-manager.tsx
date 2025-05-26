"use client"

import { useState } from "react"
import { useAdmin } from "@/app/context/admin-context"
import { Plus, Search, Edit, Trash2, X, Check, User, Mail, Phone, FileText, ShoppingBag } from "lucide-react"
import type { Customer } from "@/app/context/admin-context"

export default function CustomerManager() {
  const { customers, products, addCustomer, updateCustomer, deleteCustomer } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    measurements: {},
    selectedWears: [],
  })

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower)
    )
  })

  // Handle customer edit
  const handleEditClick = (customer: Customer) => {
    setCurrentCustomer(customer)
    setIsEditModalOpen(true)
  }

  // Handle customer view
  const handleViewClick = (customer: Customer) => {
    setCurrentCustomer(customer)
    setIsViewModalOpen(true)
  }

  // Handle customer delete
  const handleDeleteClick = (customer: Customer) => {
    setCurrentCustomer(customer)
    setIsDeleteModalOpen(true)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (currentCustomer) {
      deleteCustomer(currentCustomer.id)
      setIsDeleteModalOpen(false)
      setCurrentCustomer(null)
    }
  }

  // Handle add customer
  const handleAddCustomer = () => {
    // Generate a unique ID
    const timestamp = Date.now().toString().slice(-4)
    const id = `cust${timestamp}`

    // Create the new customer
    const customerToAdd: Customer = {
      id,
      name: newCustomer.name || "New Customer",
      email: newCustomer.email || "customer@example.com",
      phone: newCustomer.phone || "+234XXXXXXXXXX",
      measurements: newCustomer.measurements || {},
      selectedWears: newCustomer.selectedWears || [],
      notes: newCustomer.notes || "",
      createdAt: new Date()
    }

    addCustomer(customerToAdd)
    setIsAddModalOpen(false)
    setNewCustomer({
      measurements: {},
      selectedWears: [],
    })
  }

  // Handle update customer
  const handleUpdateCustomer = () => {
    if (currentCustomer) {
      updateCustomer(currentCustomer)
      setIsEditModalOpen(false)
      setCurrentCustomer(null)
    }
  }

  // Get product name by ID
  const getProductNameById = (id: string): string => {
    const product = products.find((p) => p.id === id)
    return product ? product.name : "Unknown Product"
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Customer Button */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-[#5D4037]">Customer Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Customers Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Date Added</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8D6E63]/20 text-[#8D6E63]">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{new Date(customer.createdAt).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewClick(customer)}
                        className="rounded-md bg-gray-100 px-2 py-1 text-gray-700 hover:bg-gray-200"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(customer)}
                        className="rounded-md bg-[#5D4037]/10 px-2 py-1 text-[#5D4037] hover:bg-[#5D4037]/20"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(customer)}
                        className="rounded-md bg-red-100 px-2 py-1 text-red-600 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center">
                      <User className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">No customers found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#5D4037]">Add New Customer</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  value={newCustomer.name || ""}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newCustomer.email || ""}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  placeholder="e.g. customer@example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={newCustomer.phone || ""}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  placeholder="e.g. +2347012345678"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Measurements</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Chest"
                      value={newCustomer.measurements?.chest || ""}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          measurements: { ...newCustomer.measurements, chest: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Waist"
                      value={newCustomer.measurements?.waist || ""}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          measurements: { ...newCustomer.measurements, waist: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Shoulder"
                      value={newCustomer.measurements?.shoulder || ""}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          measurements: { ...newCustomer.measurements, shoulder: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Sleeve"
                      value={newCustomer.measurements?.sleeve || ""}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          measurements: { ...newCustomer.measurements, sleeve: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={newCustomer.notes || ""}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  placeholder="Additional notes about the customer..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomer}
                  className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
                >
                  <Check className="mr-2 h-4 w-4" />
                  <span>Add Customer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {isEditModalOpen && currentCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#5D4037]">Edit Customer</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  value={currentCustomer.name}
                  onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={currentCustomer.email}
                  onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={currentCustomer.phone}
                  onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Measurements</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Chest"
                      value={currentCustomer.measurements?.chest || ""}
                      onChange={(e) =>
                        setCurrentCustomer({
                          ...currentCustomer,
                          measurements: { ...currentCustomer.measurements, chest: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Waist"
                      value={currentCustomer.measurements?.waist || ""}
                      onChange={(e) =>
                        setCurrentCustomer({
                          ...currentCustomer,
                          measurements: { ...currentCustomer.measurements, waist: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Shoulder"
                      value={currentCustomer.measurements?.shoulder || ""}
                      onChange={(e) =>
                        setCurrentCustomer({
                          ...currentCustomer,
                          measurements: { ...currentCustomer.measurements, shoulder: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Sleeve"
                      value={currentCustomer.measurements?.sleeve || ""}
                      onChange={(e) =>
                        setCurrentCustomer({
                          ...currentCustomer,
                          measurements: { ...currentCustomer.measurements, sleeve: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={currentCustomer.notes}
                  onChange={(e) => setCurrentCustomer({ ...currentCustomer, notes: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#5D4037] focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCustomer}
                  className="flex items-center rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
                >
                  <Check className="mr-2 h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Customer Modal */}
      {isViewModalOpen && currentCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#5D4037]">Customer Details</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 flex items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8D6E63]/20 text-[#8D6E63]">
                <User className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h4 className="text-xl font-bold text-gray-900">{currentCustomer.name}</h4>
                <p className="text-sm text-gray-500">Customer since {currentCustomer.createdAt.toISOString().split("T")[0]}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Contact Information */}
              <div className="rounded-lg border border-gray-200 p-4">
                <h5 className="mb-3 font-medium text-[#5D4037]">Contact Information</h5>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{currentCustomer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{currentCustomer.phone}</span>
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="rounded-lg border border-gray-200 p-4">
                <h5 className="mb-3 font-medium text-[#5D4037]">Measurements</h5>
                {Object.keys(currentCustomer.measurements).length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(currentCustomer.measurements).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                        <span className="text-sm font-medium capitalize text-gray-700">{key}:</span>
                        <span className="text-sm text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No measurements recorded</p>
                )}
              </div>

              {/* Selected Wears */}
              <div className="rounded-lg border border-gray-200 p-4">
                <h5 className="mb-3 font-medium text-[#5D4037]">Selected Products</h5>
                {currentCustomer.selectedWears.length > 0 ? (
                  <ul className="space-y-2">
                    {currentCustomer.selectedWears.map((wearId) => (
                      <li key={wearId} className="flex items-center rounded-md bg-gray-50 p-2">
                        <ShoppingBag className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm">{getProductNameById(wearId)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No products selected</p>
                )}
              </div>

              {/* Notes */}
              <div className="rounded-lg border border-gray-200 p-4">
                <h5 className="mb-3 font-medium text-[#5D4037]">Notes</h5>
                {currentCustomer.notes ? (
                  <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                    <FileText className="mb-2 h-4 w-4 text-gray-400" />
                    <p>{currentCustomer.notes}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No notes available</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsViewModalOpen(false)
                  handleEditClick(currentCustomer)
                }}
                className="flex items-center rounded-md border border-[#5D4037] px-4 py-2 text-[#5D4037] transition-colors hover:bg-[#5D4037]/5"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="rounded-md bg-[#5D4037] px-4 py-2 text-white transition-colors hover:bg-[#5D4037]/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Customer</h3>
              <p className="mt-2 text-gray-500">
                Are you sure you want to delete &quot;{currentCustomer.name}&quot;? This action cannot be undone.
              </p>

            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
