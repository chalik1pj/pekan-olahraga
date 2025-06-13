import { prisma } from "../utils/database.js"

/**
 *
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export async function participant(id) {
  try {
    const numericId = Number.parseInt(id)
    if (isNaN(numericId)) {
      throw new Error(`Invalid ID: ${id}`)
    }

    return await prisma.peserta.findUnique({
      where: { id: numericId },
      include: {
        cabang: true,
        kelas: true,
      },
    })
  } catch (error) {
    console.error(`Error finding participant with ID ${id}:`, error)
    throw error
  }
}

/**
 *
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function updateParticipantUpdateAt(id) {
  try {
    const numericId = Number.parseInt(id)
    if (isNaN(numericId)) {
      throw new Error(`Invalid ID: ${id}`)
    }

    return await prisma.peserta.update({
      where: { id: numericId },
      data: { updateAt: new Date() },
      include: {
        cabang: true,
        kelas: true,
      },
    })
  } catch (error) {
    console.error(`Error updating participant with ID ${id}:`, error)
    throw error
  }
}
