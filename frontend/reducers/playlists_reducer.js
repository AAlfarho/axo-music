import merge from 'lodash/merge';
import {
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
  REMOVE_PLAYLIST,
  FOLLOW_PLAYLIST,
  UNFOLLOW_PLAYLIST
} from '../actions/playlist_actions';
import { RECEIVE_USER } from '../actions/user_actions';

const PlaylistsReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState = {};
  let key;
  switch (action.type) {
    case RECEIVE_PLAYLISTS:
      return merge({}, state, action.playlists.playlist_detail);
    case RECEIVE_PLAYLIST:
    case FOLLOW_PLAYLIST:
    case UNFOLLOW_PLAYLIST:
      nextState = merge({}, state);
      key = parseInt(Object.keys(action.playlist.playlist_detail)[0]);
      nextState[key] = action.playlist.playlist_detail[key];
      return nextState;
    case RECEIVE_USER:
      nextState = merge({}, state);
      if(action.user.playlist_detail){
        const playlists = Object.values(action.user.playlist_detail);
        playlists.forEach(pl => {
          nextState[pl.id] = pl;
        });
      }

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
