const PlaylistsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { songService, playlistsService, validator }) => {
    const playlistsHandler = new PlaylistsHandler(songService, playlistsService, validator)
    server.route(routes(playlistsHandler))
  }
}
