const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class MusicService {
  constructor () {
    this._music = []
  }

  addAlbum ({ name, year }) {
    const id = 'Album-' + nanoid(16)
    const newAlbum = {
      id, name, year
    }

    this._music.push(newAlbum)

    const isSuccess = this._music.filter((m) => m.id === id).length > 0
    if (!isSuccess) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return id
  }

  getAlbumById (id) {
    const album = this._music.filter((a) => a.id === id)[0]
    if (!album) {
      throw new NotFoundError('Album tidak ditemukan')
    }
    return album
  }

  editAlbumById (id, { name, year }) {
    const index = this._music.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new NotFoundError('Gagal, album tidak ditemukan')
    }

    this._music[index] = {
      ...this._music[index],
      name,
      year
    }
  }

  deleteAlbumById (id) {
    const index = this._music.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new NotFoundError('Album gagal dihapus, album tidak ditemukan')
    }
    this._music.splice(index, 1)
  }
}

module.exports = MusicService
