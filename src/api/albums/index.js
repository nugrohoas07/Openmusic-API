const AlbumsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'albums',
  version: '1.0',
  register: async (server, { albumService, songService, storageService, validator }) => {
    const albumHandler = new AlbumsHandler(albumService, songService, storageService, validator)
    server.route(routes(albumHandler))
  }
}
