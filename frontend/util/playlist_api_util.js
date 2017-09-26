export const fetchPlaylists = () => (
  $.ajax({
    method: 'GET',
    url: 'api/playlists'
  })
);

export const fetchPlaylist = (id) => (
  $.ajax({
    method: 'GET',
    url: `api/playlists/${id}`
  })
);

export const createPlaylist = (playlist) => (
  $.ajax({
    method: 'POST',
    url: `api/playlists`,
    data: {playlist}
  })
);

export const updatePlaylist = (playlist) => (
  $.ajax({
    method: 'PATCH',
    url: `api/playlists/${playlist.id}`,
    data: {playlist}
  })
);

export const deletePlaylist = (id) => (
  $.ajax({
    method: 'DELETE',
    url: `api/playlists/${id}`
  })
);

export const followPlaylist = (id) => (
  $.ajax({
    method: 'POST',
    url: `api/follow_playlist/${id}`
  })
);

export const unfollowPlaylist = (id) => (
  $.ajax({
    method: 'DELETE',
    url: `api/unfollow_playlist/${id}`
  })
);
