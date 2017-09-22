import React from 'react';
import { AuthRoute, ProtectedRoute } from '../../util/route_util';
import PlaylistIndexContainer from '../playlists/playlist_index_container.jsx';
import PlaylistDetailContainer from '../playlists/playlist_detail_container.jsx';

const MainPlayground = () => (
  <div>
    <ProtectedRoute path="/collection/playlists" component={PlaylistIndexContainer} />
    <ProtectedRoute path="/user/:userId/playlist/:playlistId" component={PlaylistDetailContainer} />
  </div>

);

export default MainPlayground;
