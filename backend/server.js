import dotenv from 'dotenv';
import Hapi from '@hapi/hapi';
import inert from '@hapi/inert';
import { adminRoute } from './src/routes/adminAuth.js';
import { competitionsRoute } from './src/routes/competitions.js';
import { registerRoute } from './src/routes/registrations.js';
import { classRoutes } from './src/routes/class.js';
dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  await server.register(inert)
  server.route({
    method: 'GET',
    path: '/pekan-olahraga/{param*}',
    handler: {
      directory: {
        path: 'public',
        index: ['index.html'],
      },
    },
  })

  const admin = await adminRoute();
  const competitions = await competitionsRoute();
  const register = await registerRoute();
  const kelas = await classRoutes();

  server.route([...admin, ...competitions, ...register, ...kelas])
  await server.start()
  console.log(`Server berjalan pada: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  console.error(err.stack);
  process.exit(1);
})

init()
