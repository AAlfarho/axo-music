import React from 'react';
import {PLAYLIST_COLLECTION} from '../../util/constants';

export default class SongItem extends React.Component{
  constructor(props){
    super(props);
    this.handleDeleteSong = this.handleDeleteSong.bind(this);
  }

  handleDeleteSong(e){
    if(this.props.collectionType === PLAYLIST_COLLECTION){
      const songIds = this.props.collection.song_ids;
      const indexToDelete = songIds.indexOf(parseInt(e.target.value));
      if(indexToDelete !== -1){
        songIds.splice(indexToDelete, 1);
        this.props.updatePlaylist(this.props.collection);
      }
    }

  }

  render(){
    const {collection, song, showDelete} = this.props;
    return (
      <div style={{padding: '30px'}}>
          <ol>
            <li>
              {song.title}
              <ul>
                <li>{song.length}</li>
                <li>{song.artist_name}</li>
                <li>{song.album_name}</li>
                {
                  showDelete &&
                  <button value={song.id}
                    onClick={this.handleDeleteSong}>
                    Delete
                  </button>
                }

              </ul>
            </li>
          </ol>
      </div>
    );
  }
}
