const Hapi = require('@hapi/hapi')
const MusicService = require('./services/inMemory/MusicService')
const music = require('./api/music')

const init = async () => {
  const musicService = new MusicService()
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register({
    plugin: music,
    options: {
      service: musicService
    }
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
