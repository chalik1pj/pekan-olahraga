import { findUser } from '../repositories/auth.js';

export async function getSign(username, password) {
  return await findUser(username, password);
}
