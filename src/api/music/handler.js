const AutoBind = require('auto-bind')
const config = require('../../utils/config')

class MusicHandler {
  constructor (albumService, songService, storageService, validator) {
    this._albumService = albumService
    this._songService = songService
    this._storageService = storageService
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

  async postUploadAlbumCoverHandler (request, h) {
    const { cover } = request.payload
    const { id } = request.params

    this._validator.validateAlbumCoverHeaders(cover.hapi.headers)

    const filename = await this._storageService.writeFile(cover, cover.hapi)
    await this._albumService.addAlbumCoverById(id, filename)

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        fileLocation: `http://${config.app.host}:${config.app.port}/albums/${id}/covers/${filename}`
      }
    })
    response.code(201)
    return response
  }

  async getAlbumByIdHandler (request) {
    const { id } = request.params
    const album = await this._albumService.getAlbumById(id)
    const songs = await this._songService.getSongsByAlbumId(id)
    const coverUrl = album.cover === null ? null : `http://${config.app.host}:${config.app.port}/albums/${id}/covers/${album.cover}`
    return {
      status: 'success',
      data: {
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          coverUrl,
          songs
        }
      }
    }
  }

  async putAlbumByIdHandler (request) {
    this._validator.validateAlbumPayload(request.payload)
    const { id } = request.params
    await this._albumService.editAlbumById(id, request.payload)
    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    }
  }

  async deleteAlbumByIdHandler (request) {
    const { id } = request.params
    await this._albumService.deleteAlbumById(id)
    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }

  async postAlbumLikeHandler (request, h) {
    const { id: albumId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._albumService.getAlbumById(albumId)
    await this._albumService.verifyUserLikeAlbum(credentialId, albumId)
    await this._albumService.addAlbumLikes(credentialId, albumId)
    const response = h.response({
      status: 'success',
      message: 'Berhasil like album'
    })
    response.code(201)
    return response
  }

  async getAlbumLikesHandler (request, h) {
    const { id: albumId } = request.params

    const likesCount = await this._albumService.getAlbumLikes(albumId)
    const response = h.response({
      status: 'success',
      data: {
        likes: likesCount.likes
      }
    })
    if (likesCount.isCache) response.header('X-Data-Source', 'cache')
    return response
  }

  async deleteAlbumLikeHandler (request) {
    const { id: albumId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._albumService.deleteAlbumLike(credentialId, albumId)
    return {
      status: 'success',
      message: 'Berhasil unlike album'
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

module.exports = MusicHandler
