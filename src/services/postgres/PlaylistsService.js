const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')

class PlaylistsService {
  constructor (collaborationService, cacheService) {
    this._pool = new Pool()
    this._collaborationService = collaborationService
    this._cacheService = cacheService
  }

  async addPlaylist (name, owner) {
    const id = `playlist-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getPlaylists (owner) {
    const query = {
      text: `SELECT ps.id, ps.name, us.username
      FROM playlists ps
      JOIN users us ON ps.owner = us.id
      LEFT JOIN collaborations cl ON cl.playlist_id = ps.id
      WHERE cl.user_id = $1 OR ps.owner = $1`,
      values: [owner]
    }

    const result = await this._pool.query(query)
    return result.rows
  }

  async deletePlaylist (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Gagal dihapus, playlist tidak ditemukan')
    }
  }

  async addPlaylistSong (playlistId, songId) {
    const id = `playlist-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist')
    }
  }

  async getPlaylistById (id) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username 
      FROM playlists 
      INNER JOIN users 
      ON playlists.owner = users.id 
      WHERE playlists.id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    return result.rows[0]
  }

  async deletePlaylistSong (playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal manghapus, lagu tidak ada di playlist ini')
    }
  }

  async addPlaylistSongActivity (playlistId, songId, userId, action) {
    const id = `psActivity-${nanoid(16)}`
    const time = new Date().toISOString()

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Playlist activity gagal ditambahkan')
    }
    await this._cacheService.delete(`activities:${playlistId}`)
  }

  async getPlaylistSongActivity (playlistId) {
    try {
      const result = await this._cacheService.get(`activities:${playlistId}`)
      return {
        data: JSON.parse(result),
        isCache: true
      }
    } catch (error) {
      const query = {
        text: `SELECT us.username, songs.title, psa.action, psa.time
        FROM playlist_song_activities psa
        JOIN users us ON psa.user_id = us.id
        JOIN songs ON psa.song_id = songs.id
        WHERE psa.playlist_id = $1
        ORDER BY psa.time ASC`,
        values: [playlistId]
      }
      const result = await this._pool.query(query)

      const activities = result.rows
      await this._cacheService.set(`activities:${playlistId}`, JSON.stringify(activities))

      return {
        data: activities,
        isCache: false
      }
    }
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    const playlist = result.rows[0]

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini')
    }
  }

  async verifyPlaylistAccess (playlistId, userId) {
    // check is user owner?
    try {
      await this.verifyPlaylistOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      // check is user collaborator?
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }
}

module.exports = PlaylistsService
