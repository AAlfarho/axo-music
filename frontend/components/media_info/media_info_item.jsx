import React from 'react';
import { Link } from 'react-router-dom';
export default class MediaInfoItem extends React.Component {

  constructor(props){
    super(props);
    this.handleReproduceCollection = this.handleReproduceCollection.bind(this);
  }

  handleReproduceCollection(event){
    event.preventDefault();
    if(this.props.collection.song_ids.length > 0){
      this.props.reproduceCollection(this.props.collection);
    }

  }

  render(){
    return(
      <div className="vbox media-info-flex-container">
        <div onClick={this.handleReproduceCollection}
          className="vbox media-info-image-container">
          <img src={this.props.image_url} />
        </div>
        <div className="vbox media-info-footer">
          <div className="media-info-link">
            <Link to={this.props.detail_url}>{this.props.media_name}</Link>
          </div>
          <div className="media-info-author">
            By: {this.props.media_author_name}
          </div>
        </div>
      </div>
    );
  }
}
