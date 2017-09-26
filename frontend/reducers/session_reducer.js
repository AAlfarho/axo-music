import merge from 'lodash/merge';
import {RECEIVE_CURRENT_USER} from '../actions/session_actions';
import {
  RECEIVE_PLAYLIST,
  REMOVE_PLAYLIST,
  FOLLOW_PLAYLIST,
  UNFOLLOW_PLAYLIST
} from '../actions/playlist_actions';

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
    case FOLLOW_PLAYLIST:
      nextState = merge({}, state);
          debugger;
      const plToFollow = action.playlist.playlist_detail[parseInt(Object.keys(action.playlist.playlist_detail)[0])];
      if(plToFollow.user_follows && state.currentUser.follow_playlists_ids.indexOf(plToFollow.id) === -1){
        nextState.currentUser.follow_playlists_ids.push(plToFollow.id);
      }
    return nextState;
    case UNFOLLOW_PLAYLIST:
    nextState = merge({}, state);
    const plToUnfollow = action.playlist.playlist_detail[parseInt(Object.keys(action.playlist.playlist_detail)[0])];
    if(!plToUnfollow.user_follows){
      const indexToRemove =
      state.currentUser.follow_playlists_ids.indexOf(plToUnfollow.id);
      if(indexToRemove !== -1){
        nextState.currentUser.follow_playlists_ids.splice(indexToRemove, 1);
      }
    }
    return nextState;

    default:
      return state;
  }
};

export default SessionReducer;
