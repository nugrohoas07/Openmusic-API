const AutoBind = require('auto-bind')

class MusicHandler {
  constructor (albumService, songService, validator) {
    this._albumService = albumService
    this._songService = songService
    this._validator = validator
    AutoBind(this)
  }

  async postAlbumHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const { name, year } = request.payload
    const albumId = await this._albumService.addAlbum({ name, year })
    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId
      }
    })
    response.code(201)
    return response
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params
    const album = await this._albumService.getAlbumById(id)
    const songs = await this._songService.getSongsByAlbumId(id)
    return {
      status: 'success',
      data: {
        album: { ...album, songs }
      }
    }
  }

  async putAlbumByIdHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const { id } = request.params
    await this._albumService.editAlbumById(id, request.payload)
    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    }
  }

  async deleteAlbumByIdHandler (request, h) {
    const { id } = request.params
    await this._albumService.deleteAlbumById(id)
    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }

  async postSongHandler (request, h) {
    this._validator.validateSongsPayload(request.payload)
    const { title, year, genre, performer, duration = undefined, albumId = undefined } = request.payload
    const songId = await this._songService.addSong({ title, year, genre, performer, duration, albumId })
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

  async getSongByIdHandler (request, h) {
    const { id } = request.params
    const song = await this._songService.getSongById(id)
    return {
      status: 'success',
      data: {
        song
      }
    }
  }

  async putSongByIdHandler (request, h) {
    this._validator.validateSongsPayload(request.payload)
    const { id } = request.params
    const { title, year, genre, performer, duration = undefined, albumId = undefined } = request.payload
    await this._songService.editSongById(id, { title, year, genre, performer, duration, albumId })
    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui'
    }
  }

  async deleteSongByIdHandler (request, h) {
    const { id } = request.params
    await this._songService.deleteSongById(id)
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    }
  }
}

module.exports = MusicHandler
