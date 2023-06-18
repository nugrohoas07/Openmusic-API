const MusicHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'music',
  version: '1.0',
  register: async (server, { service }) => {
    const musicHandler = new MusicHandler(service)
    server.route(routes(musicHandler))
  }
}
