const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
 
class PlaylistsongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }
 
  async addSongplaylist(playlistId, songId) {
    const id = nanoid(16);
 
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new InvariantError('Lagu berhasil ditambahkan ke playlist');
    }
    await this._cacheService.delete(`playlists:${playlistId}`);
    return result.rows[0].id;
  }
  async getPlaylistsongs(playlistId) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM playlistsongs JOIN songs ON songs.id = playlistsongs.song_id WHERE playlistsongs.playlist_id = $1 GROUP BY playlistsongs.song_id, songs.id',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    await this._cacheService.set(`playlists:${playlistId}`, JSON.stringify(result.rows));
    return result.rows;
  }

  async deletePlaylistsongs(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
    await this._cacheService.delete(`playlists:${playlistId}`);
  }
  async verifyPlaylistsongs(playlistId, songId) {
    const query = {
      text: 'SELECT * FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal diverifikasi');
    }
  }
}
module.exports = PlaylistsongsService;