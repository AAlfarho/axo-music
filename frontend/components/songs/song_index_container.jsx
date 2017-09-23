import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {
  updatePlaylist,
  fetchPlaylists
} from '../../actions/playlist_actions.js';
import SongIndex from './song_index';
import {PLAYLIST_COLLECTION} from '../../util/constants';

const mapStateToProps = (state, ownProps) => {
  const {collectionType, collection, songs} = ownProps;
  let showDelete = false;
  if(collectionType === PLAYLIST_COLLECTION){
    showDelete = collection.author_id === state.session.currentUser.id;
  } else {
      // forn when using the index container for other purposes
      //like displaying songs from album or artist or the search!
  }

  return {
    collection,
    songs,
    showDelete,
    collectionType
  };
};

const mapDispacthToProps = (dispatch) => ({
  updatePlaylist: (id) => dispatch(updatePlaylist(id)),
  fetchPlaylists: () => dispatch(fetchPlaylists())
});

export default withRouter(
  connect(mapStateToProps, mapDispacthToProps)(SongIndex)
);
