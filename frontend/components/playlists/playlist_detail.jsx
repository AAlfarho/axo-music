import React from 'react';
import MediaInfoItem from '../media_info/media_info_item';
import SongIndexContainer from '../songs/song_index_container';
import {PLAYLIST_COLLECTION} from '../../util/constants';

export default class PlaylistIndex extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.props.fetchPlaylist(this.props.match.params.playlistId);
  }

  componentWillReceiveProps(newProps){
    const currId = this.props.match.params.playlistId;
    const newId = newProps.match.params.playlistId;
    if(currId && newId && currId !== newId){
      this.props.fetchPlaylist(newProps.match.params.playlistId);
    }


  }

  render(){
    const {playlist, songs} = this.props;
    return(
      <div className="hbox playlist-detail-flex-container">
        <div className="playlist-media-info-container">
          <MediaInfoItem img_url={playlist.image_url} media_name={playlist.name}
              media_author={playlist.author_id} media_author_name={playlist.author_name}
              detail_url={`/user/${playlist.author_id}/playlist/${playlist.id}`}/>
        </div>

        <div className="playlist-song-index-container vieport">
          <SongIndexContainer
            collectionType={PLAYLIST_COLLECTION}
            collection={playlist}
            songs={Object.values(songs)}
            />
        </div>
      </div>

    );
  }
}
