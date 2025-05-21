import { participant, updateParticipantUpdateAt } from '../repositories/qrcode.js'

/**
 *
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export async function qrService(id) {
  try {
    const existingParticipant = await participant(id)
    if (!existingParticipant) {
      return null
    }

    if (existingParticipant.status !== 'APPROVED') {
      console.warn(`Attempted re-registration for non-approved participant ID: ${id}`)
      return {
        participant: existingParticipant,
        message: 'Pendaftaran belum disetujui atau ditolak. Silakan hubungi panitia!.',
      }
    }

    const updatedParticipant = await updateParticipantUpdateAt(id)

    return {
      participant: updatedParticipant,
      message: updatedParticipant.updateAt
        ? 'Registrasi ulang berhasil diperbarui'
        : 'Registrasi ulang pertama kali berhasil',
    }
  } catch (error) {
    console.error(`QR service error for ID ${id}:`, error)
    throw error
  }
}
