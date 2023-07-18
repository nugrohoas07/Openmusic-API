const SongsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'songs',
  version: '1.0',
  register: async (server, { songService, validator }) => {
    const songsHandler = new SongsHandler(songService, validator)
    server.route(routes(songsHandler))
  }
}
