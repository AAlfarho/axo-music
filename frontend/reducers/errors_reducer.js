import { combineReducers } from 'redux';
import sessionErrorsReducer from './session_errors_reducer';
import playlistErrorsReducer from './playlists_errors_reducer';

export default combineReducers({
  session: sessionErrorsReducer,
  playlist: playlistErrorsReducer
});
