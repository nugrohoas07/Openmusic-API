const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class AlbumService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addAlbum ({ name, year }) {
    const id = 'album-' + nanoid(16)

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getAlbumById (id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('album tidak ditemukan')
    }
    return result.rows[0]
  }

  async editAlbumById (id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Gagal, album tidak ditemukan')
    }
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan')
    }
  }

  async addAlbumCoverById (id, cover) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [cover, id]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Gagal, album tidak ditemukan')
    }
  }

  async addAlbumLikes (userId, albumId) {
    const id = 'albmlikes-' + nanoid(16)
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new InvariantError('Gagal like album')
    }
    await this._cacheService.delete(`likes:${albumId}`)
  }

  async getAlbumLikes (albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`)
      return {
        likes: JSON.parse(result),
        isCache: true
      }
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [albumId]
      }
      const result = await this._pool.query(query)

      const likesCount = result.rowCount
      await this._cacheService.set(`likes:${albumId}`, likesCount)
      return {
        likes: likesCount,
        isCache: false
      }
    }
  }

  async deleteAlbumLike (userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal unlike album')
    }
    await this._cacheService.delete(`likes:${albumId}`)
  }

  async verifyUserLikeAlbum (userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    }

    const result = await this._pool.query(query)
    if (result.rowCount) {
      throw new InvariantError('Gagal like album')
    }
  }

  async isDataFromCache (albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`)
      console.log(result)
      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = AlbumService
