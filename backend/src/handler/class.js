import { getAllClassService, getClassByIdService } from "../services/class.js"

export async function getAllClass(request, h) {
  try {
    const competitions = await getAllClassService()
    return h
      .response({
        status: "success",
        data: {
          competitions,
        },
      })
      .code(200)
  } catch (error) {
    console.error("Error in getAllClass handler:", error)

    return h
      .response({
        status: "fail",
        message: "Failed to fetch classes",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
      .code(500)
  }
}

export async function getClassById(request, h) {
  const { id } = request.params

  try {
    const kelas = await getClassByIdService(id)
    if (!kelas) {
      return h
        .response({
          status: "fail",
          message: "Kelas tidak ditemukan",
        })
        .code(404)
    }

    return h
      .response({
        status: "success",
        data: {
          kelas,
        },
      })
      .code(200)
  } catch (error) {
    console.error("Error in getClassById handler:", error)

    return h
      .response({
        status: "fail",
        message: "Failed to fetch class",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
      .code(500)
  }
}
