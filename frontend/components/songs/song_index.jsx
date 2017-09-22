import React from 'react';
import SongItem from './song_item';

const SongIndex = (props) => (
  <ol>
    {
      props.songs.map((song, index) => (
        <li>
          <SongItem song={song}
            showDelete={props.showDelete}
            collection={props.collection}
            collectionType={props.collectionType}
            updatePlaylist={props.updatePlaylist}
            />
        </li>
      ))
    }
  </ol>
);

export default SongIndex;
