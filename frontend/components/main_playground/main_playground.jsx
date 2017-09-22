import React from 'react';
import { AuthRoute, ProtectedRoute } from '../../util/route_util';
import PlaylistIndexContainer from '../playlists/playlist_index_container.jsx';

const MainPlayground = () => (
  <div>
    <ProtectedRoute path="/collection/playlists" component={PlaylistIndexContainer} />
  </div>

);

export default MainPlayground;
