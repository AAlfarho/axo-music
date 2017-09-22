import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {logout} from '../../actions/session_actions.js';
import {fetchPlaylists, fetchPlaylist} from '../../actions/playlist_actions.js';
import PlaylistDetail from './playlist_detail';

const mapStateToProps = (state, ownProps) => {
  let playlist = state.playlists[ownProps.match.params.playlistId];
  let songs = {};
  if(playlist){
    playlist.song_ids.forEach(id => {
      if(state.songs[id]){
        songs[id] = state.songs[id];
      }
    });
  } else {
    playlist = {};
  }


  return {
    playlist,
    songs
  };

};

const mapDispacthToProps = (dispatch) => ({
  fetchPlaylist: (id) => dispatch(fetchPlaylist(id))
});

export default withRouter(
  connect(mapStateToProps, mapDispacthToProps)(PlaylistDetail)
);
