import { createCabang, getAllCompe, getCompeById } from '../repositories/cabang.js'

export async function createSport(data) {
  const sport = await createCabang({
    nama: data.nama,
    participant: data.participant,
    harga: data.harga,
  })

  return {
    id: sport.id,
    nama: sport.nama,
    participant: sport.participant,
    harga: sport.harga,
  }
}

export async function findAllSport() {
  return await getAllCompe();
}

export async function findSportById(id) {
  const sport = await getCompeById(id);
  if (!sport) return null;

  return {
    id: sport.id,
    nama: sport.nama,
    slot: sport.slot,
    harga: sport.harga,
  };
}
