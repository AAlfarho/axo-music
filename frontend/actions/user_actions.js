import * as UserAPIUtil from '../util/user_api_util';

export const FRIEND_USER = "FRIEND_USER";
export const UNFRIEND_USER = "UNFRIEND_USER";
export const RECEIVE_USER = "RECEIVE_USER";
export const RECEIVE_FRIENDSHIP_ERRORS = "RECEIVE_FRIENDSHIP_ERRORS";


////////////////////////////////////////
///////////action creators/////////////
//////////////////////////////////////
export const receiveFriendUser = user => ({
  type: FRIEND_USER,
  user,
});

export const receiveUnfriendUser = user => ({
  type: UNFRIEND_USER,
  user
});

export const receiveFriendshipErrors = errors => ({
  type: RECEIVE_FRIENDSHIP_ERRORS,
  errors
});

export const receiveUser = user => ({
  type: RECEIVE_USER,
  user
});

////////////////////////////////////////
////////thunk action creators//////////
//////////////////////////////////////
export const friendUser = (id) => dispatch  => (
  UserAPIUtil.friendUser(id).then(
    friend => dispatch(receiveFriendUser(friend)),
    errors => dispatch(receiveFriendshipErrors(errors.responseJSON))
  )
);

export const unfriendUser = (id) => dispatch  => (
  UserAPIUtil.unfriendUser(id).then(
    exFriend => dispatch(receiveUnfriendUser(exFriend)),
    errors => dispatch(receiveFriendshipErrors(errors.responseJSON))
  )
);

export const fetchUser = (id) => dispatch => (
  UserAPIUtil.fetchUser(id).then(
    user => dispatch(receiveUser(user)),
    errors => dispatch(receiveFriendshipErrors(errors.responseJSON))
  )
);
