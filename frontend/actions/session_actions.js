import * as SessionAPIUtil from '../util/session_api_util';

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";

//action creators
export const receiveCurrentUser = currentUser => ({
  type: RECEIVE_CURRENT_USER,
  currentUser
});

export const receiveSessionErrors = errors => ({
  type:RECEIVE_SESSION_ERRORS,
  errors
});



//thunk action creators
export const signup = user => dispatch => (
  SessionAPIUtil.signup(user)
  .then(
    currentUser => dispatch(receiveCurrentUser(currentUser)),
    errors => dispatch(receiveSessionErrors(errors.responseJSON))
  )
);

export const login = user => dispatch => (
  SessionAPIUtil.login(user)
  .then(
    currentUser => dispatch(receiveCurrentUser(currentUser)),
    errors => dispatch(receiveSessionErrors(errors.responseJSON))
  )
);

export const logout = () => dispatch => (
  SessionAPIUtil.logout()
  .then(
    user => dispatch(receiveCurrentUser(null)),
    errors => dispatch(receiveSessionErrors(errors.responseJSON))
  )
);
