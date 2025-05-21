import { getSign } from '../services/auth.js'
import { JWT } from '../utils/jwt.js'

export async function userLogin(request, h) {
  try {
    const { username, password } = request.payload;
    const user = await getSign(username, password);

    if (user === null) {
      return h.response({
        status: 'fail',
        message: 'Username atau password salah',
      }).code(401);
    }
    return h.response({
      status: 'success',
      token: JWT.sign(user.id),
    }).code(200);
  } catch (error) {
    console.log(error);

    return h.response({
      status: 'fail',
      message: 'ERROR',
    }).code(500);
  }
}
