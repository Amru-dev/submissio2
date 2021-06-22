const ClientError = require('../../exceptions/ClientError');

class PlaylistsongsHandler {
  constructor(playlistsongsService, playlistsService, validator) {
    this._playlistsongsService = playlistsongsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postPlaylistsongHandler = this.postPlaylistsongHandler.bind(this);
    this.deletePlaylistsongHandler = this.deletePlaylistsongHandler.bind(this);
  }
  async postPlaylistsongHandler(request, h) {
    try {
      const { id: userId } = request.auth.credentials;
      const { playlistId, any } = request.params;
      if (any !== 'songs') {
        throw new NotFoundError('Resource not found');
      }
      console.log(request.payload);
      this._validator.validatePlaylistsongPayload(request.payload);
      const { songId } = request.payload;
      await this._playlistService.verifyPlaylistAccess(playlistId, userId);
      const playlistsongId = await this._playlistsongsService.addplaylistsong(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
        data: {
          playlistsongId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
 
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
  async getPlaylistsongHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, songId } = request.payload;
    await this._playlistService.verifyplaylistOwner(playlistId, credentialId);
    const playlistsongId = await this._playlistsongsService.getplaylistsong(songId);
    return {
      status: 'success',
      data: {
        playlistsongId,
      },
    };
  }

  async deletePlaylistsongHandler(request, h) {
    try {
      this._validator.validatePlaylistsongPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, songId } = request.payload;
 
      await this._playlistsService.verifyNoteOwner(playlistId, credentialId);
      await this._playlistsongsService.deleteCollaboration(playlistId, songId);
 
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
 
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}
module.exports = PlaylistsongsHandler;