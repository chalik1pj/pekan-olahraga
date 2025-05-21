import { createSport, findAllSport, findSportById } from '../services/sport.js'

export async function createCompetitions(request, h) {
  try {
    await createSport(request.payload);

    return h.response({
      status: 'success',
      message: 'Berhasil membuat cabang',
    }).code(201);
  } catch (error) {
    console.log(error);

    return h.response({
      status: 'fail',
      message: 'ERROR',
    }).code(500);
  }
}

export async function getAllCompetitions(request, h) {
  try {
    const competitions = await findAllSport()
    return h.response({
      status: 'success',
      data: {
        competitions,
      },
    }).code(200);
  } catch (error) {
    console.log(error);

    return h.response({
      status: 'fail',
      message: 'ERROR',
    }).code(500);
  }
}

export async function getCompetitionById(request, h) {
  try {
    const { id } = request.params;
    const competition = await findSportById(id);

    return h.response({
      status: 'success',
      data: {
        competition,
      },
    }).code(200);
  } catch (error) {
    console.log(error);

    return h.response({
      status: 'fail',
      message: 'ERROR',
    }).code(500);
  }
}
