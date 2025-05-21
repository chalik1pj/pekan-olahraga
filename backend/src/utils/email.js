import dotenv from "dotenv"
import ejs from "ejs"
import nodemailer from "nodemailer"
import { generateQRCode } from "./QRCode.js"

dotenv.config()

// Create a reusable transporter object
const transport = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USERNAME,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  // Add timeout settings
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000, // 10 seconds
  socketTimeout: 15000, // 15 seconds
})

// Verify transporter connection at startup
transport.verify((error, success) => {
  if (error) {
    console.error("Email transport verification failed:", error)
  } else {
    console.log("Email transport is ready to send messages")
  }
})

/**
 *
 * @param {string} target
 * @param {string} nama
 * @param {string} kelas
 * @param {string} komting
 */
export async function sendRegistNotify(target, nama, kelas, komting) {
  try {
    console.log(`Preparing registration email for ${target}...`)

    const html = await ejs.renderFile("src/views/regist-notif.ejs", {
      nama,
      komting,
      kelas,
    })

    const result = await transport.sendMail({
      from: process.env.NODEMAILER_USERNAME,
      to: target,
      subject: "PEKAN OLAHRAGA 2025",
      html,
    })

    console.log(`Email sent to ${target}, messageId: ${result.messageId}`)
    return result
  } catch (error) {
    console.error(`Failed to send registration email to ${target}:`, error)
    throw error
  }
}

export async function sendRejectNotify(target, nama, kelas, komting) {
  try {
    console.log(`Preparing rejection email for ${target}...`)

    const html = await ejs.renderFile("src/views/regist-reject.ejs", {
      nama,
      kelas,
      komting,
    })

    const result = await transport.sendMail({
      from: process.env.NODEMAILER_USERNAME,
      to: target,
      subject: "PEKAN OLAHRAGA 2025",
      html,
    })

    console.log(`Rejection email sent to ${target}, messageId: ${result.messageId}`)
    return result
  } catch (error) {
    console.error(`Failed to send rejection email to ${target}:`, error)
    throw error
  }
}

export async function sendApprovedNotify(target, nama, komting, kelas, id) {
  try {
    console.log(`Preparing approval email with QR code for ${target}...`)

    const qrcode = await generateQRCode(id, nama, kelas, komting)
    const base64Data = qrcode.split(',')[1]
    const qrCodeCid = `qrcode-${id}@gameon.com`

    const html = await ejs.renderFile("src/views/regist-approved.ejs", {
      nama,
      komting,
      kelas,
      id,
      qrCodeCid,
    })

    const result = await transport.sendMail({
      from: process.env.NODEMAILER_USERNAME,
      to: target,
      subject: "PEKAN OLAHRAGA 2025",
      html,
      attachments: [
        {
          filename: `qrcode-${id}.png`,
          content: base64Data,
          encoding: "base64",
          cid: qrCodeCid,
        },
      ],
    })

    console.log(`Approval email with QR code sent to ${target}, messageId: ${result.messageId}`)
    return result
  } catch (error) {
    console.error(`Failed to send approval email to ${target}:`, error)
    throw error
  }
}
