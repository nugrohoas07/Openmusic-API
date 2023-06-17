const { nanoid } = require('nanoid')

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
      throw new Error('Catatan gagal ditambahkan')
    }

    return id
  }

  getAlbumById (id) {
    const album = this._music.filter((a) => a.id === id)[0]
    if (!album) {
      throw new Error('Album Not Found')
    }
    return album
  }

  editAlbumById (id, { name, year }) {
    const index = this._music.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new Error('Fail, Album Not Found')
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
      throw new Error('Fail to delete, Album Not Found')
    }
    this._music.splice(index, 1)
  }
}

module.exports = MusicService
