import { userLogin } from '../handler/auth.js'

export async function adminRoute() {
  return [
    {
      method: 'POST',
      path: '/api/admin/login',
      handler: userLogin,
    },
  ]
}
