class MusicHandler {
  constructor (service) {
    this.service = service
    this.postAlbumHandler = this.postAlbumHandler.bind(this)
  }

  postAlbumHandler (request, h) {
    try {
      const { name, year } = request.payload
      const albumID = this.service.addAlbum({ name, year })

      const response = h.reponse({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumID
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if (error) {
        const response = h.reponse({
          status: 'fail',
          message: error.message
        })
        response.code(error.statuscode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      return response
    }
  }
}

module.exports = MusicHandler
