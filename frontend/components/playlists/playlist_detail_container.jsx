import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {logout} from '../../actions/session_actions.js';
import {fetchPlaylists, fetchPlaylist} from '../../actions/playlist_actions.js';
import PlaylistIndex from './playlist_index';

const mapStateToProps = (state, ownProps) => {
  let playlist = {};
  let songs = {};


  return { };
};

const mapDispacthToProps = (dispatch) => ({
  fetchPlaylists: () => dispatch(fetchPlaylists()),
  fetchPlaylist: (id) => dispatch(fetchPlaylist(id))
});

export default withRouter(
  connect(mapStateToProps, mapDispacthToProps)(PlaylistIndex)
);
