import merge from 'lodash/merge';
import { REPRODUCE_COLLECTION } from '../actions/media_player_actions.js';
import { RECEIVE_PLAYLIST } from '../actions/playlist_actions';

const MediaPlayerReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState = {};
  switch (action.type) {
    case REPRODUCE_COLLECTION:
      return {
        collection: action.collection,
        song_ids: action.collection.song_ids
      };
    case RECEIVE_PLAYLIST:
    nextState = merge({}, state);
    //the following will take care of updating the playback for new songs or removed songs
    if(state.collection && action.playlist.playlist_detail[state.collection.id]) {
      nextState.collection.song_ids = action.playlist.playlist_detail[state.collection.id].song_ids;
      nextState.song_ids = action.playlist.playlist_detail[state.collection.id].song_ids;
    }
    return nextState;
    default:
    return state;
  }
};

export default MediaPlayerReducer;
