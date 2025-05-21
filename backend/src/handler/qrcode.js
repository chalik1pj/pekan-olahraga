import { qrService } from "../services/qrcode.js"

/**
 *
 * @param {Object} request
 * @param {Object} h
 * @returns {Object}
 */
export async function scanQrCode(request, h) {
  try {
    const { id } = request.params;

    const numericId = Number.parseInt(id, 10);
    if (isNaN(numericId)) {
      return h.response({
        status: 'fail',
        message: 'ID QR Code tidak valid. Harus berupa angka.',
      }).code(400);
    }

    const result = await qrService(numericId);

    if (!result) {
      return h.response({
        status: 'fail',
        message: 'QR Code tidak valid. Peserta tidak ditemukan.',
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Registrasi ulang berhasil',
      data: result,
    }).code(200);
  } catch (error) {
    console.error("QR code scan error:", error)

    return h.response({
      status: 'fail',
      message: 'Tidak dapat melakukan scan QR. Silakan coba lagi.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }).code(500);
  }
}
