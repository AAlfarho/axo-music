import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {logout} from '../../actions/session_actions.js';
import {
  fetchPlaylists,
  fetchPlaylist,
  createPlaylist,
} from '../../actions/playlist_actions.js';
import PlaylistIndex from './playlist_index';

const mapStateToProps = (state, ownProps) => {
  let playlists = [];
  let userToDisplayPlaylsits = state.session.currentUser;
  if(ownProps.match.path !== '/collection/playlists' && ownProps.match.params.userId){
    userToDisplayPlaylsits = state.users[ownProps.match.params.userId];
  }
  if(userToDisplayPlaylsits){
    userToDisplayPlaylsits.playlists_ids.forEach(id => {
      if(state.playlists[id]) {
        playlists.push(state.playlists[id]);
      }
    });
  }

  return {
    playlists,
    userId: userToDisplayPlaylsits.id,
    currentUser: state.session.currentUser
  };
};

const mapDispacthToProps = (dispatch) => ({
  fetchPlaylists: () => dispatch(fetchPlaylists()),
  fetchPlaylist: (id) => dispatch(fetchPlaylist(id)),
  createPlaylist: (playlist) => dispatch(createPlaylist(playlist))
});

export default withRouter(
  connect(mapStateToProps, mapDispacthToProps)(PlaylistIndex)
);
