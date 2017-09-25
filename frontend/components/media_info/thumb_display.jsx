import React from 'react';
import { Link } from 'react-router-dom';
export default class ThumbDisplay extends React.Component {

  handleReproduceCollection(event){
    event.preventDefault();
    this.props.reproduceCollection(this.props.collection);
  }

  render(){
    const {song, collection} = this.props;
    const imageURL = song.image_url || '';
    const songName = song.title || '';
    const songArtist = song.artist_name || '';
    let collectionLink = '';
    if(collection && collection.id && collection.author_id){
      collectionLink = `/user/${collection.author_id}/playlist/${collection.id}`;
    }

    return(
      <div className="hbox thumb-info-flex-container">
        <div className="vbox thumb-info-image-container">
          {
            !!imageURL &&
            <img src={imageURL} />
          }
        </div>
        <div className="vbox thumb-song-details">
          <div className="thumb-song-name">
            {songName}
          </div>
          <div className="thumb-song-band">
            {songArtist}
          </div>
        </div>
      </div>
    );
  }
}
