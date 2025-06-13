import { prisma } from "../utils/database.js"

export async function findAllClass() {
  try {
    return await prisma.kelas.findMany({
      orderBy: {
        nama: "asc",
      },
    })
  } catch (error) {
    console.error("Error in findAllClass:", error)
    throw error
  }
}

export async function findClassById(id) {
  try {
    return await prisma.kelas.findFirst({
      where: { id: Number.parseInt(id) },
    })
  } catch (error) {
    console.error("Error in findClassById:", error)
    throw error
  }
}
