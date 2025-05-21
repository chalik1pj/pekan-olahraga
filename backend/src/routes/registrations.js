import { scanQrCode } from '../handler/qrcode.js';
import {
  createRegistPeserta,
  getAllActionAdminRegister,
  getReRegisteredParticipant,
  statusRegist,
} from '../handler/registration.js';

export async function registerRoute() {
  return [
    {
      method: 'POST',
      path: '/api/pekan-olahraga/register',
      handler: createRegistPeserta,
    },
    {
      method: 'PATCH',
      path: "/api/admin/scan/{id}",
      handler: scanQrCode,
    },
    {
      method: 'GET',
      path: '/api/admin/register',
      handler: getAllActionAdminRegister,
    },
    {
      method: 'PATCH',
      path: '/api/admin/registration/{id}/{status}',
      handler: statusRegist,
    },
    {
      method: 'GET',
      path: '/api/admin/registrasi-ulang',
      handler: getReRegisteredParticipant,
    },
  ];
}
