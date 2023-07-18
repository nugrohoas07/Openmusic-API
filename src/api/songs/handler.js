const AutoBind = require('auto-bind')

class SongsHandler {
  constructor (songService, validator) {
    this._songService = songService
    this._validator = validator
    AutoBind(this)
  }

  async postSongHandler (request, h) {
    this._validator.validateSongsPayload(request.payload)
    const songId = await this._songService.addSong(request.payload)
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId
      }
    })
    response.code(201)
    return response
  }

  async getAllSongsHandler (request) {
    const { title = undefined, performer = undefined } = request.query
    const queryParam = {
      title,
      performer
    }
    const songs = await this._songService.getSongs(queryParam)
    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  async getSongByIdHandler (request) {
    const { id } = request.params
    const song = await this._songService.getSongById(id)
    return {
      status: 'success',
      data: {
        song
      }
    }
  }

  async putSongByIdHandler (request) {
    this._validator.validateSongsPayload(request.payload)
    const { id } = request.params
    const { title, year, genre, performer, duration = undefined, albumId = undefined } = request.payload
    await this._songService.editSongById(id, { title, year, genre, performer, duration, albumId })
    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui'
    }
  }

  async deleteSongByIdHandler (request) {
    const { id } = request.params
    await this._songService.deleteSongById(id)
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    }
  }
}

module.exports = SongsHandler
