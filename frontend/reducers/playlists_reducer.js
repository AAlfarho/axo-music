import merge from 'lodash/merge';
import {
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
  REMOVE_PLAYLIST
} from '../actions/playlist_actions';

const PlaylistsReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState = {};
  switch (action.type) {
    case RECEIVE_PLAYLISTS:
      return merge({}, state, action.playlists);
    case RECEIVE_PLAYLIST:
      nextState = merge({}, state);
      const key = parseInt(Object.keys(action.playlist)[0]);
      nextState[key] = action.playlist[key];
      return nextState;
    case REMOVE_PLAYLIST:
      nextState = merge({}, state);
      delete nextState[parseInt(Object.keys(action.playlist)[0])];
      return nextState;
    default:
      return state;
  }
};

export default PlaylistsReducer;
