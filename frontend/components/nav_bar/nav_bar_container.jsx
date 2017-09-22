import {connect} from 'react-redux';

import NavBar from './nav_bar';
import {logout} from '../../actions/session_actions.js';
import {fetchPlaylists} from '../../actions/playlist_actions';

const mapStateToProps = (state)  => ({
  currentUser: state.session.currentUser
});

const mapDispacthToProps = (dispatch) => ({
  fetchPlaylists: () => dispatch(fetchPlaylists()),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(NavBar);
