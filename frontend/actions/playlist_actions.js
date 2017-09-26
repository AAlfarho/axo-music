import * as PlaylistAPIUtil from '../util/playlist_api_util';
export const RECEIVE_PLAYLISTS = "RECEIVE_PLAYLISTS";
export const RECEIVE_PLAYLIST = "RECEIVE_PLAYLIST";
export const REMOVE_PLAYLIST = "REMOVE_PLAYLIST";
export const RECEIVE_PLAYLIST_ERRORS = "RECEIVE_PLAYLIST_ERRORS";
export const FOLLOW_PLAYLIST = "FOLLOW_PLAYLIST";
export const UNFOLLOW_PLAYLIST = "UNFOLLOW_PLAYLIST";
////////////////////////////////////////
///////////action creators/////////////
//////////////////////////////////////
export const receivePlaylists = playlists => ({
  type: RECEIVE_PLAYLISTS,
  playlists
});

export const receivePlaylist = playlist => ({
  type: RECEIVE_PLAYLIST,
  playlist
});

export const removePlaylist = playlist => ({
  type: REMOVE_PLAYLIST,
  playlist
});

export const receivePlaylistErrors = errors => ({
  type: RECEIVE_PLAYLIST_ERRORS,
  errors
});

export const receiveFollowPlaylist = playlist => ({
  type: FOLLOW_PLAYLIST,
  playlist
});

export const receiveUnfollowPlaylist = playlist => ({
  type: UNFOLLOW_PLAYLIST,
  playlist
});

////////////////////////////////////////
////////thunk action creators//////////
//////////////////////////////////////
export const fetchPlaylists = () => dispatch => (
  PlaylistAPIUtil.fetchPlaylists()
  .then(
    playlists => dispatch(receivePlaylists(playlists)),
    errors => dispatch(receivePlaylistErrors(errors.responseJSON))
  )
);

export const fetchPlaylist = (id) => dispatch => (
  PlaylistAPIUtil.fetchPlaylist(id)
  .then(
    playlist => dispatch(receivePlaylist(playlist)),
    errors => dispatch(receivePlaylistErrors(errors.responseJSON))
  )
);

export const createPlaylist = (post) => dispatch => (
  PlaylistAPIUtil.createPlaylist(post)
  .then(
    playlist => dispatch(receivePlaylist(playlist)),
    errors => dispatch(receivePlaylistErrors(errors.responseJSON))
  )
);

export const updatePlaylist = (post) => dispatch => (
  PlaylistAPIUtil.updatePlaylist(post)
  .then(
    playlist => dispatch(receivePlaylist(playlist)),
    errors => dispatch(receivePlaylistErrors(errors.responseJSON))
  )
);

export const deletePlaylist = (id) => dispatch => (
  PlaylistAPIUtil.deletePlaylist(id)
  .then(
    playlist => dispatch(removePlaylist(playlist)),
    errors => dispatch(receivePlaylistErrors(errors.responseJSON))
  )
);

export const followPlaylist = (id) => dispatch => (
  PlaylistAPIUtil.followPlaylist(id).then(
    playlist => dispatch(receiveFollowPlaylist(playlist)),
    errors => dispatch(receivePlaylistErrors(errors.responseJSON))
  )
);

export const unfollowPlaylist = (id) => dispatch => (
  PlaylistAPIUtil.unfollowPlaylist(id).then(
    playlist => dispatch(receiveUnfollowPlaylist(playlist)),
    errors => dispatch(receivePlaylistErrors(errors.responseJSON))
  )
);
