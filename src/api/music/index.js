const MusicHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'music',
  version: '1.0',
  register: async (server, { albumService, songService, validator }) => {
    const musicHandler = new MusicHandler(albumService, songService, validator)
    server.route(routes(musicHandler))
  }
}
