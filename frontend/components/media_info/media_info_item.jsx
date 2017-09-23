import React from 'react';
import { Link } from 'react-router-dom';

const MediaInfoItem = (props) => (
  <div className="vbox media-info-flex-container">
    <div className="vbox media-info-image-container">
      <img src="https://media.pitchfork.com/photos/5929c52813d197565213bf56/1:1/w_320/45f756c9.jpg" />
      {props.image_url}
    </div>
    <div className="vbox media-info-footer">
      <div className="media-info-link">
        <Link to={props.detail_url}>{props.media_name}</Link>
      </div>
      <div className="media-info-author">
        By: {props.media_author_name}
      </div>
    </div>
  </div>
);

export default MediaInfoItem;
