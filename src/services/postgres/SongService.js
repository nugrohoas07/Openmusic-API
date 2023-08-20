const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class SongService {
  constructor () {
    this._pool = new Pool()
  }

  async addSong ({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getSongs (param) {
    let query = 'SELECT id,title,performer FROM songs'
    if (param.title !== undefined && param.performer !== undefined) {
      query = {
        text: 'SELECT id,title,performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
        values: [`%${param.title}%`, `%${param.performer}%`]
      }
    } else if (param.title !== undefined || param.performer !== undefined) {
      const coloumn = param.title ? 'title' : 'performer'
      const val = param.title ? param.title : param.performer
      query = {
        text: `SELECT id,title,performer FROM songs WHERE ${coloumn} ILIKE $1`,
        values: [`%${val}%`]
      }
    }
    const result = await this._pool.query(query)
    return result.rows
  }

  async getSongById (id) {
    const query = {
      text: 'SELECT id,title,year,genre,performer,duration,album_id as "albumId" FROM songs WHERE id = $1',
      values: [id]
    }
    const { rows, rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }
    return rows[0]
  }

  async getSongsByAlbumId (albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId]
    }
    const result = await this._pool.query(query)
    return result.rows
  }

  async editSongById (id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs set title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Gagal, lagu tidak ditemukan')
    }
  }

  async deleteSongById (id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan')
    }
  }

  async getSongsOnPlaylist (playlistId) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs INNER JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1',
      values: [playlistId]
    }
    const result = await this._pool.query(query)
    return result.rows
  }

  async verifySongExist (id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }
  }
}

module.exports = SongService
