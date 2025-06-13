import { findAllClass, findClassById } from "../repositories/class.js"

export async function getAllClassService() {
  try {
    return await findAllClass()
  } catch (error) {
    console.error("Error in getAllClassService:", error)
    throw error
  }
}

export async function getClassByIdService(id) {
  try {
    const kelas = await findClassById(id)
    if (!kelas) return null

    return {
      id: kelas.id,
      nama: kelas.nama,
      komting: kelas.komting,
    }
  } catch (error) {
    console.error("Error in getClassByIdService:", error)
    throw error
  }
}
