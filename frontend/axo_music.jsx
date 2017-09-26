import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';
import * as PlaylistActions from './actions/playlist_actions';
import * as PlaylistAPIUtil from './util/playlist_api_util';
import * as UserActions from './actions/user_actions';

document.addEventListener("DOMContentLoaded", () => {
  let store;
  if (window.currentUser.user_details) {
    const preloadedState = { session: { currentUser: window.currentUser.user_details } };
    const users = {};
    if(window.currentUser.friend_details){
      Object.values(window.currentUser.friends_details).forEach(user => {
        users[user.id] = user;
      });
      preloadedState['users'] = users;
    }
    store = configureStore(preloadedState);
    delete window.currentUser.user_details;
  } else {
    store = configureStore();
  }
  window.store = store;
  window.PlaylistActions = PlaylistActions;
  window.PlaylistAPIUtil = PlaylistAPIUtil;
  window.UserActions = UserActions;
  const root = document.getElementById('root');
  ReactDOM.render(<Root store={store} />, root);
});
