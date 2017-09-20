import { connect } from 'react-redux';
import {login, signup, receiveSessionErrors} from '../../actions/session_actions';
import SessionForm from './session_form';

const mapStateToProps = (state) => ({
  errors: state.errors.session,
  loggedIn: state.session.currentUser
});

const mapDispacthToProps = (dispatch, {location}) => {
  const formType = location.pathname.slice(1);
  const formAction = formType === 'login' ? login : signup;

  return {
    formType,
    formAction: (user) => dispatch(formAction(user)),
    demoLogin: (user) => dispatch(login(user)),
    receiveErrors: (errors) => dispatch(receiveSessionErrors(errors))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(SessionForm);
