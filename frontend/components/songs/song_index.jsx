import React from 'react';
import SongItem from './song_item';

export default class SongIndex extends React.Component {

  componentWillMount(){
    this.props.fetchPlaylists();
  }

  render(){
    return(
      <div className="vbox song-index-flex-container viewport">
        {
          this.props.songs.map((song, index) => (
            <SongItem key={song.id} song={song}
              showDelete={this.props.showDelete}
              collection={this.props.collection}
              collectionType={this.props.collectionType}
              updatePlaylist={this.props.updatePlaylist}
              />
          ))
        }
      </div>
    );
  }
}
