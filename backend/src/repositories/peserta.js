import { prisma } from "../utils/database.js"
import { PesertaStatus } from "@prisma/client"

export async function createRegistrationPeserta(data) {
  return await prisma.peserta.createMany({ data })
}

export async function countAllRegistration() {
  return await prisma.peserta.count()
}

export async function countApprovedRegistration() {
  return await prisma.peserta.count({
    where: {
      status: PesertaStatus.APPROVED,
    },
  })
}

export async function getApprovedParticipant() {
  return await prisma.peserta.findMany({
    where: {
      status: PesertaStatus.APPROVED,
    },
    include: {
      cabang: true,
      kelas: true,
    },
  })
}

export async function getPendingRegistration() {
  return await prisma.peserta.findMany({
    where: {
      status: PesertaStatus.PENDING,
    },
    include: {
      cabang: true,
      kelas: true,
    },
  })
}

export async function updatePeserta(id, status) {
  return await prisma.peserta.update({
    data: { status },
    where: { id },
  })
}

export async function getById(id) {
  return await prisma.peserta.findFirst({
    where: {
      id: Number.parseInt(id),
    },
    include: {
      cabang: true,
      kelas: true,
    },
  })
}

export async function findReRegisteredParticipant() {
  return await prisma.peserta.findMany({
    where: {
      status: PesertaStatus.APPROVED,
      updateAt: {
        not: null,
      },
    },
    include: {
      cabang: true,
      kelas: true,
    },
  })
}

export async function countReRegisteredParticipant() {
  return await prisma.peserta.count({
    where: {
      status: PesertaStatus.APPROVED,
      updateAt: {
        not: null,
      },
    },
  })
}
