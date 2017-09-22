import merge from 'lodash/merge';
import {
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
  REMOVE_PLAYLIST
} from '../actions/playlist_actions';

const SongsReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState = {};
  switch (action.type) {
    case RECEIVE_PLAYLISTS:
      return merge({}, state, action.playlists.songs_detail);
    case RECEIVE_PLAYLIST:
      return merge({}, state, action.playlist.songs_detail);
    case REMOVE_PLAYLIST:
      return state;
    default:
      return state;
  }
};

export default SongsReducer;
