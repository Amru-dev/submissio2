const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{playlistId}/{any}',
    handler: handler.postPlaylistsongHandler,
    options: {
      auth: 'playlistsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/{any}',
    handler: handler.getPlaylistsongHandler,
    options: {
      auth: 'playlistsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/{any}',
    handler: handler.deletePlaylistsongHandler,
    options: {
      auth: 'playlistsapp_jwt',
    },
  },
];
   
module.exports = routes;