const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
 
class PlaylistsongsService {
  constructor() {
    this._pool = new Pool();
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
    return result.rows[0].id;
  }
  async getPlaylistsongs(songId) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM playlists INNER JOIN playlistsongs ON playlists.id = playlistsongs.playlist_id INNER JOIN songs ON playlistsong.song_id = songs.id WHERE playlistsongs.song_id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
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
  }
  async verifyPlaylistsongs(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, userId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal diverifikasi');
    }
  }
}
module.exports = PlaylistsongsService;