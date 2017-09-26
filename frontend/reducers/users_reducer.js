import merge from 'lodash/merge';
import {
  FRIEND_USER,
  UNFRIEND_USER,
  RECEIVE_USER
} from '../actions/user_actions';
import { RECEIVE_CURRENT_USER } from '../actions/session_actions';

const UsersReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState = {};
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
    nextState = merge({}, state);
    const friendDetails = action.friends_details;
    Object.values(friendDetails).forEach(user => {
      nextState[user.id] = user;
    });
    return nextState;
    case RECEIVE_USER:
    case FRIEND_USER:
    case UNFRIEND_USER:
      nextState = merge({}, state);
      const user = action.user.user_details;
      const userFriends = action.user.friends_details;
      nextState[user.id] = user;
      if(userFriends){
        Object.values(userFriends).forEach(friend => {
          nextState[friend.id] = friend;
        });
      }
      return nextState;
    default:
    return state;
  }
};

export default UsersReducer;
