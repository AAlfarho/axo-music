import {connect} from 'react-redux';
import {
  updatePlaylist,
  fetchPlaylists,
} from '../../actions/playlist_actions.js';
import AddToPlaylistList from './add_to_playlist';

const mapStateToProps = (state, ownProps) => {
  const currentUserPlaylists = state.session.currentUser.playlists_ids;
  const playlistsToDisplay = [];
  currentUserPlaylists.forEach(playlist => playlistsToDisplay.push(state.playlists[playlist]));
  return {
    playlists: playlistsToDisplay,
    song_id: ownProps.song_id
  };
};

const mapDispacthToProps = (dispatch) => ({
  updatePlaylist: (playlist) => dispatch(updatePlaylist(playlist)),
  fetchPlaylists: () => dispatch(fetchPlaylists())
});

export default connect(
  mapStateToProps, mapDispacthToProps
)(AddToPlaylistList);
