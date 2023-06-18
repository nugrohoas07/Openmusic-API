const AutoBind = require('auto-bind')
const ClientError = require('../../exceptions/ClientError')

class MusicHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator
    AutoBind(this)
  }

  postAlbumHandler (request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload)
      const { name, year } = request.payload
      const albumId = this._service.addAlbum({ name, year })
      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statuscode)
        return response
      }
      // Server Error 500
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      return response
    }
  }

  getAlbumByIdHandler (request, h) {
    try {
      const { id } = request.params
      const album = this._service.getAlbumById(id)
      return {
        status: 'success',
        data: {
          album
        }
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statuscode)
        return response
      }
      // Server Error 500
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      return response
    }
  }

  putAlbumByIdHandler (request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload)
      const { id } = request.params
      this._service.editAlbumById(id, request.payload)
      return {
        status: 'success',
        message: 'Album berhasil diperbarui'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statuscode)
        return response
      }
      // Server Error 500
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      return response
    }
  }

  deleteAlbumByIdHandler (request, h) {
    try {
      const { id } = request.params
      this._service.deleteAlbumById(id)
      return {
        status: 'success',
        message: 'Album berhasil dihapus'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statuscode)
        return response
      }
      // Server Error 500
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
