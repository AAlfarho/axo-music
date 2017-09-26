import { combineReducers } from 'redux';
import errorsReducer from './errors_reducer';
import sessionReducer from './session_reducer';
import playlistReducer from './playlists_reducer';
import songsReducer from './songs_reducer';
import mediaPlayerReducer from './media_player_reducer';
import usersReducer from './users_reducer';

export default combineReducers({
  errors: errorsReducer,
  session: sessionReducer,
  playlists: playlistReducer,
  songs: songsReducer,
  playback: mediaPlayerReducer,
  users: usersReducer
});
