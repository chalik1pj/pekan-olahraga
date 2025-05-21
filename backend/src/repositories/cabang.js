import { prisma } from '../utils/database.js'

export async function createManyCabang(data) {
  return await prisma.cabang.createMany({ data });
}

export async function createCabang(data) {
  return await prisma.cabang.create({ data });
}

export async function findCabangByName(nama) {
  return await prisma.cabang.findFirst({
    where: {
      nama: {
        equals: nama,
        mode: 'insensitive',
      },
    },
  });
}

export async function updateCabang(id, data) {
  return await prisma.cabang.update({
    where: { id },
    data,
  });
}

export async function getAllCompe() {
  return await prisma.cabang.findMany();
}

export async function getCompeById(id) {
  return await prisma.cabang.findFirst({
    where: { id: Number.parseInt(id) },
  });
}
