import { createCompetitions, getAllCompetitions, getCompetitionById } from '../handler/competition.js'

export async function competitionsRoute() {
  return [
    {
      method: 'POST',
      path: '/api/admin/cabang-olahraga',
      handler: createCompetitions,
    },
    {
      method: 'GET',
      path: '/api/admin/cabang-olahraga',
      handler: getAllCompetitions,
    },
    {
      method: 'GET',
      path: '/api/admin/cabang-olahraga/{id}',
      handler: getCompetitionById,
    },
  ]
}
