import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  friendUser,
  unfriendUser,
  fetchUser,
} from '../../actions/user_actions';
import UserThumb from './user_thumb';

const mapStateToProps = (state, ownProps) => {
  let userToDisplay = state.session.currentUser;
  if(ownProps.match.params.userId){
    userToDisplay = state.users[ownProps.match.params.userId];
    if(!userToDisplay){
      userToDisplay = {id: ownProps.match.params.userId};
    }
  }
  return {
    currentUser: state.session.currentUser,
    user: userToDisplay
  };
};

const mapDispacthToProps = (dispatch) => ({
  friendUser: (id) => dispatch(friendUser(id)),
  unfriendUser: (id) => dispatch(unfriendUser(id)),
  fetchUser: (id) => dispatch(fetchUser(id))
});

export default withRouter(
  connect(mapStateToProps, mapDispacthToProps)(UserThumb)
);
