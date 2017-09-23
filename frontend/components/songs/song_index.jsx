import React from 'react';
import SongItem from './song_item';

const SongIndex = (props) => (
  <div className="vbox song-index-flex-container viewport">
    {
      props.songs.map((song, index) => (
          <SongItem song={song}
            showDelete={props.showDelete}
            collection={props.collection}
            collectionType={props.collectionType}
            updatePlaylist={props.updatePlaylist}
            fetchPlaylists={props.fetchPlaylists}
            />
      ))
    }
  </div>
);

export default SongIndex;
