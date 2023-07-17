const MusicHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'music',
  version: '1.0',
  register: async (server, { albumService, songService, storageService, validator }) => {
    const musicHandler = new MusicHandler(albumService, songService, storageService, validator)
    server.route(routes(musicHandler))
  }
}
