import {connect} from 'react-redux';

import {logout} from '../../actions/session_actions.js';
import MainCanvas from './main_canvas';

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser
});

const mapDispacthToProps = (dispatch) => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispacthToProps)(MainCanvas);
