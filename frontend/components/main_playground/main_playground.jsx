import React from 'react';
import { Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../../util/route_util';
import PlaylistIndexContainer from '../playlists/playlist_index_container.jsx';
import PlaylistDetailContainer from '../playlists/playlist_detail_container.jsx';

const MainPlayground = () => (
  <div className="vbox viewport">
    <Switch>
      <ProtectedRoute path="/collection/playlists" component={PlaylistIndexContainer} />
      <ProtectedRoute exact path="/user/:userId/playlist/:playlistId"
                      component={PlaylistDetailContainer} />

      <ProtectedRoute exact path="/user/:userId"             component={PlaylistIndexContainer} />
      <ProtectedRoute path="/" component={PlaylistIndexContainer} />
    </Switch>
  </div>

);

export default MainPlayground;
