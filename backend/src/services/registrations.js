import {
  countAllRegistration,
  countApprovedRegistration,
  countReRegisteredParticipant,
  createRegistrationPeserta,
  findReRegisteredParticipant,
  getApprovedParticipant,
  getById,
  getPendingRegistration,
  updatePeserta,
} from "../repositories/peserta.js"
import { sendRegistNotify } from "../utils/email.js"
import { createCabang, findCabangByName, updateCabang } from "../repositories/cabang.js"
import { prisma } from "../utils/database.js"

export async function registProcess(data) {
  let competition
  let createdParticipants
  let participantData = []

  try {
    console.log("Starting registration process with data:", {
      sportName: data.nama,
      participantCount: data.participant,
      price: data.harga,
      pesertaCount: data.pesertaGroup.length,
    })

    const result = await prisma.$transaction(
      async (tx) => {
        const existingBranch = await findCabangByName(data.nama)

        if (existingBranch) {
          console.log(`Using existing branch: ${existingBranch.nama} (ID: ${existingBranch.id})`)

          if (existingBranch.participant !== data.participant || existingBranch.harga !== data.harga) {
            competition = await updateCabang(existingBranch.id, {
              participant: data.participant,
              harga: data.harga,
            })
            console.log(`Updated branch data: ${competition.nama} (ID: ${competition.id})`)
          } else {
            competition = existingBranch
          }
        } else {
          competition = await createCabang({
            nama: data.nama,
            participant: data.participant,
            harga: data.harga,
          })
          console.log(`Created new branch: ${competition.nama} (ID: ${competition.id})`)
        }

        participantData = data.pesertaGroup.map((p) => ({
          nama: p.nama,
          email: p.email,
          nowa: p.nowa,
          kelasId: p.kelasId,
          cabangId: competition.id,
        }))

        createdParticipants = await createRegistrationPeserta(participantData)
        console.log(`Created ${participantData.length} participants for branch ID: ${competition.id}`)

        return {
          success: true,
          competitionId: competition.id,
          isExistingBranch: !!existingBranch,
          participantCount: participantData.length,
        }
      },
      {
        timeout: 5000,
      },
    )

    if (result.success && participantData.length > 0) {
      console.log("Transaction successful, now sending emails to participants...")

      // Fetch class information for email notifications
      const classIds = [...new Set(participantData.map((p) => p.kelasId))]
      const classesInfo = await Promise.all(
        classIds.map(async (kelasId) => {
          const kelas = await prisma.kelas.findUnique({
            where: { id: kelasId },
          })
          return kelas
        }),
      )

      const emailPromises = participantData.map(async (p) => {
        try {
          const kelasInfo = classesInfo.find((k) => k.id === p.kelasId)
          await sendRegistNotify(p.email, p.nama, kelasInfo?.nama || "", kelasInfo?.komting || "")
          console.log(`✅ Email notification sent to ${p.email}`)
          return { email: p.email, success: true }
        } catch (error) {
          console.error(`❌ Failed to send email to ${p.email}:`, error)
          return { email: p.email, success: false, error: error.message }
        }
      })

      const emailResults = await Promise.all(emailPromises)

      const successfulEmails = emailResults.filter((r) => r.success).length
      console.log(`Email sending complete: ${successfulEmails}/${participantData.length} emails sent successfully`)

      return {
        ...result,
        emailsSent: successfulEmails,
        totalEmails: participantData.length,
      }
    }

    return result
  } catch (error) {
    console.error("Registration process error:", error)
    return {
      success: false,
      message: `Gagal memproses pendaftaran: ${error.message}`,
    }
  }
}

export async function countRegist() {
  try {
    const allRegist = await countAllRegistration()
    const approve = await countApprovedRegistration()
    return { allRegist, approve }
  } catch (error) {
    console.error("Error counting registrations:", error)
    throw error
  }
}

export async function findPendingRegist() {
  try {
    const pendingRegist = await getPendingRegistration()
    return pendingRegist
  } catch (error) {
    console.error("Error finding pending registrations:", error)
    throw error
  }
}

export async function getApprovedRegist() {
  try {
    const approveRegist = await getApprovedParticipant()
    return approveRegist
  } catch (error) {
    console.error("Error getting approved registrations:", error)
    throw error
  }
}

export async function putRegistService(id, status) {
  try {
    console.log(`Updating participant status: ID=${id}, Status=${status}`)
    const result = await updatePeserta(id, status)
    console.log("Update result:", result)
    return result
  } catch (error) {
    console.error(`Error updating participant status (ID=${id}, Status=${status}):`, error)
    throw error
  }
}

export async function getRegistByIdService(id) {
  try {
    const regist = await getById(id)
    if (!regist) {
      console.log(`No registration found with ID: ${id}`)
      return null
    }

    return {
      id: regist.id,
      nama: regist.nama,
      email: regist.email,
      nowa: regist.nowa,
      kelas: regist.kelas?.nama || "Unknown",
      komting: regist.kelas?.komting || "Unknown",
      status: regist.status,
      cabang: regist.cabang,
    }
  } catch (error) {
    console.error(`Error getting registration by ID (${id}):`, error)
    throw error
  }
}

export async function getReRegistService() {
  try {
    const participant = await findReRegisteredParticipant()
    return participant
  } catch (error) {
    console.error("Error getting re-registered participants:", error)
    throw error
  }
}

export async function countReRegistService() {
  try {
    const participant = await countReRegisteredParticipant()
    return participant
  } catch (error) {
    console.error("Error counting re-registered participants:", error)
    throw error
  }
}
