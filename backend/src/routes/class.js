import { getAllClass, getClassById } from "../handler/class.js"

export async function classRoutes() {
  return [
    {
      method: "GET",
      path: "/api/pekan-olahraga/class",
      handler: getAllClass,
    },
    {
      method: "GET",
      path: "/api/pekan-olahraga/class/{id}",
      handler: getClassById,
    },
  ]
}
