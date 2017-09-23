import merge from 'lodash/merge';
import {RECEIVE_CURRENT_USER} from '../actions/session_actions';
import {RECEIVE_PLAYLIST, REMOVE_PLAYLIST} from '../actions/playlist_actions';

const _nullUser = Object.freeze({currentUser: null});

const SessionReducer = (state = _nullUser, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
    const currentUser = action.currentUser;
    return merge({}, {currentUser});
    case RECEIVE_PLAYLIST:
    let nextState = merge({},state);
    const playlist = action.playlist.playlist_detail[parseInt(Object.keys(action.playlist.playlist_detail)[0])];
    if(playlist.author_id === state.currentUser.id &&
        !state.currentUser.playlists_ids.includes(playlist.id)){
      nextState.currentUser.playlists_ids.push(playlist.id);
    }
    return nextState;
    case REMOVE_PLAYLIST:
    let newState = merge({}, state);
    const playlistToDelete = action.playlist.playlist_detail[parseInt(Object.keys(action.playlist.playlist_detail)[0])];
    const index = state.currentUser.playlists_ids.indexOf(playlistToDelete.id);
    if(index !== -1){
      newState.currentUser.playlists_ids.splice(index, 1);
    }
    return newState;
    default:
      return state;
  }
};

export default SessionReducer;
