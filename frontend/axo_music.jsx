import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';
import * as PlaylistActions from './actions/playlist_actions';
import * as PlaylistAPIUtil from './util/playlist_api_util';

document.addEventListener("DOMContentLoaded", () => {
  let store;
  if (window.currentUser) {
    const preloadedState = { session: { currentUser: window.currentUser } };
    store = configureStore(preloadedState);
    delete window.currentUser;
  } else {
    store = configureStore();
  }
  window.store = store;
  window.PlaylistActions = PlaylistActions;
  window.PlaylistAPIUtil = PlaylistAPIUtil;
  const root = document.getElementById('root');
  ReactDOM.render(<Root store={store} />, root);
});
