import merge from 'lodash/merge';
import {
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
  REMOVE_PLAYLIST,
  FOLLOW_PLAYLIST,
  UNFOLLOW_PLAYLIST
} from '../actions/playlist_actions';

const PlaylistsReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState = {};
  switch (action.type) {
    case RECEIVE_PLAYLISTS:
      return merge({}, state, action.playlists.playlist_detail);
    case RECEIVE_PLAYLIST:
    case FOLLOW_PLAYLIST:
    case UNFOLLOW_PLAYLIST:
      nextState = merge({}, state);
      const key = parseInt(Object.keys(action.playlist.playlist_detail)[0]);
      nextState[key] = action.playlist.playlist_detail[key];
      return nextState;
    case REMOVE_PLAYLIST:
      nextState = merge({}, state);
      delete nextState[parseInt(Object.keys(action.playlist.playlist_detail)[0])];
      return nextState;
    default:
      return state;
  }
};

export default PlaylistsReducer;
