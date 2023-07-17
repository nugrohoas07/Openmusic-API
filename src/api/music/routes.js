const path = require('path')

const routes = (handler) => [
  // -----ALBUM HANDLER-----
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumByIdHandler
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putAlbumByIdHandler
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumByIdHandler
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postUploadAlbumCoverHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000
      }
    }
  },
  {
    method: 'GET',
    path: '/albums/{id}/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file')
      }
    }
  },
  // -----SONGS HANDLER-----
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getAllSongsHandler
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongByIdHandler
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongByIdHandler
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongByIdHandler
  }
]

module.exports = routes
