import {
  countRegist,
  countReRegistService,
  findPendingRegist,
  getApprovedRegist,
  getRegistByIdService,
  getReRegistService,
  putRegistService,
  registProcess,
} from "../services/registrations.js"
import { sendApprovedNotify, sendRejectNotify } from "../utils/email.js"

export async function createRegistPeserta(request, h) {
  try {
    console.log("Registration payload received:", request.payload)
    const result = await registProcess(request.payload)
    console.log("Registration process result:", result)

    if (result && result.success === true) {
      // Return success response
      return h.response({
        status: "success",
        message: result.isExistingBranch
          ? "Berhasil Mendaftar menggunakan cabang yang sudah ada"
          : "Berhasil Mendaftar dengan cabang baru",
        data: {
          competitionId: result.competitionId,
          isExistingBranch: result.isExistingBranch,
          emailsSent: result.emailsSent,
          totalEmails: result.totalEmails,
        },
      }).code(201);
    } else {
      return h.response({
        status: "fail",
        message: result.message || "Gagal mendaftar. Silakan coba lagi.",
      }).code(400);
    }
  } catch (error) {
    console.error("Registration error:", error)

    return h.response({
      status: "fail",
      message: "Gagal mendaftar. Silakan coba lagi.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    }).code(500);
  }
}

export async function getAllActionAdminRegister(request, h) {
  try {
    const { status, id } = request.query

    if (!status) {
      return h.response({
        status: "fail",
        message: "Query status tidak ada",
      }).code(400);
    }

    switch (status) {
      case "count": {
        const count = await countRegist()
        return h.response({
          status: "success",
          data: { count },
        }).code(200);
      }

      case "detail": {
        if (!id) {
          return h.response({
            status: "fail",
            message: "Untuk aksi detail, parameter id harus disediakan.",
          }).code(400);
        }
        const detail = await getRegistByIdService(id)
        if (!detail) {
          return h.response({
            status: "fail",
            message: "Registrasi tidak ditemukan.",
          }).code(404);
        }
        return h.response({
          status: "success",
          data: detail,
        }).code(200);
      }

      case "pending": {
        const pending = await findPendingRegist()
        return h.response({
          status: "success",
          data: { pending },
        }).code(200);
      }

      case "approved": {
        const approved = await getApprovedRegist()
        return h.response({
          status: "success",
          data: { approved },
        }).code(200)
      }

      default:
        return h.response({
          status: "fail",
          message: "Aksi tidak valid. Aksi yang valid adalah count, detail, pending, atau approved.",
        }).code(400);
    }
  } catch (error) {
    console.error("Error in getAllActionAdminRegister:", error)

    return h.response({
      status: "fail",
      message: "Terjadi Kesalahan",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    }).code(500);
  }
}

export async function statusRegist(request, h) {
  try {
    const { id, status } = request.params
    console.log(`Updating registration status: ID=${id}, Status=${status}`)

    const numericId = Number.parseInt(id, 10)

    if (isNaN(numericId)) {
      return h.response({
        status: "fail",
        message: "ID tidak valid",
      }).code(400);
    }

    if (!["APPROVED", "PENDING", "REJECT"].includes(status)) {
      return h.response({
        status: "fail",
        message: "Status tidak valid",
      }).code(400);
    }

    const patchStatus = await putRegistService(numericId, status)
    console.log("Updated registration:", patchStatus)

    let emailResult = null

    if (status === "APPROVED") {
      try {
        emailResult = await sendApprovedNotify(
          patchStatus.email,
          patchStatus.nama,
          patchStatus.komting,
          patchStatus.kelas,
          patchStatus.id,
        )
        console.log(`Approval notification sent to ${patchStatus.email}`)
      } catch (err) {
        console.error("Error sending approval notification:", err)
      }
    }

    if (status === "REJECT") {
      try {
        emailResult = await sendRejectNotify(
          patchStatus.email,
          patchStatus.nama,
          patchStatus.komting,
          patchStatus.kelas,
        )
        console.log(`Rejection notification sent to ${patchStatus.email}`)
      } catch (err) {
        console.error("Error sending rejection notification:", err)
      }
    }

    return h.response({
      status: "success",
      message: `Status berhasil diubah menjadi ${status}`,
      data: patchStatus,
      emailSent: emailResult ? true : false,
    })
  } catch (error) {
    console.error("Error updating registration status:", error)

    return h.response({
      status: "fail",
      message: "Gagal mengubah status registrasi",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    }).code(500);
  }
}

export async function getReRegisteredParticipant(request, h) {
  try {
    const { status } = request.query

    if (!status) {
      return h.response({
        status: "fail",
        message: "Query status tidak ada",
      }).code(400);
    }

    switch (status) {
      case "get": {
        const participant = await getReRegistService()
        return h.response({
          status: "success",
          data: { participant },
        }).code(200);
      }

      case "count": {
        const participant = await countReRegistService()
        return h.response({
          status: "success",
          data: { participant },
        }).code(200);
      }

      default:
        return h.response({
          status: "fail",
          message: "Aksi tidak valid.",
        }).code(400);
    }
  } catch (error) {
    console.error("Error in getReRegisteredParticipant:", error)

    return h
      .response({
        status: "fail",
        message: "Terjadi Kesalahan",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
      .code(500)
  }
}
