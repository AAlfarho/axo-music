import React from 'react';
import { Link } from 'react-router-dom';

const MediaInfoItem = (props) => (
  <div>
    <div>{props.image_url}</div>
    <Link to={props.detail_url}>{props.media_name}</Link>
    <div>{props.media_author}</div>
  </div>
);

export default MediaInfoItem;
