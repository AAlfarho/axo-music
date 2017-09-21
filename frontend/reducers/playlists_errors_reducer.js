import merge from 'lodash/merge';
import {
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
  REMOVE_PLAYLIST,
  RECEIVE_PLAYLIST_ERRORS
} from '../actions/playlist_actions';

const _nullError = [];

const PlaylistErrorsReducer = (state = _nullError, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_PLAYLIST_ERRORS:
      return action.errors;
    case RECEIVE_PLAYLISTS:
    case RECEIVE_PLAYLIST:
    case REMOVE_PLAYLIST:
      return _nullError;
    default:
        return state;
  }
};

export default PlaylistErrorsReducer;
