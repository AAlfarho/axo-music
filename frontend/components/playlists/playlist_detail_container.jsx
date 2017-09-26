import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {logout} from '../../actions/session_actions.js';
import {
  fetchPlaylists,
  fetchPlaylist,
  updatePlaylist,
  deletePlaylist,
  followPlaylist,
  unfollowPlaylist
} from '../../actions/playlist_actions.js';
import PlaylistDetail from './playlist_detail';

const mapStateToProps = (state, ownProps) => {
  let playlist = state.playlists[ownProps.match.params.playlistId];
  let songs = [];
  if(playlist){
    playlist.song_ids.forEach(id => {
      if(state.songs[id]){
        songs.push(state.songs[id]);
      }
    });
  } else {
    playlist = {};
  }


  return {
    playlist,
    songs,
    state
  };

};

const mapDispacthToProps = (dispatch) => ({
  fetchPlaylist: (id) => dispatch(fetchPlaylist(id)),
  updatePlaylist: (playlist) => dispatch(updatePlaylist(playlist)),
  deletePlaylist: (id) => dispatch(deletePlaylist(id)),
  followPlaylist: (id) => dispatch(followPlaylist(id)),
  unfollowPlaylist: (id) => dispatch(unfollowPlaylist(id))
});

export default withRouter(
  connect(mapStateToProps, mapDispacthToProps)(PlaylistDetail)
);
