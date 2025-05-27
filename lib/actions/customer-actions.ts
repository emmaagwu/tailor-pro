"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma/db"
import type { Customer } from "@/lib/types"

// Get all customers
export async function getCustomers(): Promise<Customer[]> {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      measurements: customer.measurements as Record<string, string>,
      selectedWears: [], // This would need to be implemented with a proper relation in the database
      notes: customer.notes || "",
      createdAt: customer.createdAt,
    }))
  } catch (error) {
    console.error("Failed to fetch customers:", error)
    throw new Error("Failed to fetch customers")
  }
}

// Create a new customer
// export async function createCustomer(data: {
//   name: string
//   email: string
//   phone: string
//   measurements: Record<string, string>
//   selectedWears: string[]
//   notes: string
// }): Promise<Customer> {
//   try {
//     const { selectedWears, ...customerData } = data

//     const customer = await prisma.customer.create({
//       data: {
//         ...customerData,
//         measurements: customerData.measurements as any,
//       },
//     })

//     revalidatePath("/admin/customers")

//     return {
//       ...customer,
//       measurements: customer.measurements as Record<string, string>,
//       selectedWears: [],
//       notes: customer.notes || "",
//       // createdAt: customer.createdAt.toISOString().split("T")[0],
//       createdAt: customer.createdAt,
//     }
//   } catch (error) {
//     console.error("Failed to create customer:", error)
//     throw new Error("Failed to create customer")
//   }
// }



export async function createCustomer(data: {
  name: string
  email: string
  phone: string
  measurements: Record<string, string>
  selectedWears: string[]
  notes: string
}): Promise<Customer> {
  try {
    const customer = await prisma.customer.create({
      data: {
        ...data,
        measurements: data.measurements as Record<string, string>,
      },
    })

    revalidatePath("/admin/customers")

    return {
      ...customer,
      measurements: customer.measurements as Record<string, string>,
      selectedWears: [],
      notes: customer.notes || "",
      createdAt: customer.createdAt,
    }
  } catch (error) {
    console.error("Failed to create customer:", error)
    throw new Error("Failed to create customer")
  }
}

// Update a customer
// export async function updateCustomer(
//   id: string,
//   data: {
//     name: string
//     email: string
//     phone: string
//     measurements: Record<string, string>
//     selectedWears: string[]
//     notes: string
//   },
// ) {
//   try {
//     const { selectedWears, ...customerData } = data

//     await prisma.customer.update({
//       where: { id },
//       data: {
//         ...customerData,
//         measurements: customerData.measurements as any,
//       },
//     })

//     revalidatePath("/admin/customers")
//     return { success: true }
//   } catch (error) {
//     console.error(`Failed to update customer with ID ${id}:`, error)
//     throw new Error(`Failed to update customer with ID ${id}`)
//   }
// }


export async function updateCustomer(
  id: string,
  data: {
    name: string
    email: string
    phone: string
    measurements: Record<string, string>
    selectedWears: string[]
    notes: string
  },
) {
  try {
    await prisma.customer.update({
      where: { id },
      data: {
        ...data,
        measurements: data.measurements as Record<string, string>,
      },
    })

    revalidatePath("/admin/customers")
    return { success: true }
  } catch (error) {
    console.error(`Failed to update customer with ID ${id}:`, error)
    throw new Error(`Failed to update customer with ID ${id}`)
  }
}

// Delete a customer
export async function deleteCustomer(id: string) {
  try {
    await prisma.customer.delete({
      where: { id },
    })

    revalidatePath("/admin/customers")
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete customer with ID ${id}:`, error)
    throw new Error(`Failed to delete customer with ID ${id}`)
  }
}
