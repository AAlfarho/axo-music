import React from 'react';
import MediaInfoItem from '../media_info/media_info_item';

export default class PlaylistIndex extends React.Component{
  constructor(props){
    super(props);
    this.handlePlaylistUserFetching = this.handlePlaylistUserFetching.bind(this);
  }

  componentDidMount(){
    const {userId, currentUser} = this.props;
    if(userId === currentUser.id){
      this.props.fetchPlaylists();
    }
  }

  componentWillReceiveProps(newProps){
    //this.handlePlaylistUserFetching(newProps);
  }

  handlePlaylistUserFetching(propsToUse){
    const {userId, currentUser} = propsToUse;
    if(userId !== currentUser.id && this.props !== propsToUse){
      this.props.fetchPlaylists();
    }
  }

  render(){
    return(
      <div>
        {
          this.props.playlists.map(playlist => (
            <MediaInfoItem img_url={playlist.image_url} media_name={playlist.name}
              media_author={playlist.author_id} detail_url={`/user/${this.props.userId}/playlist/${playlist.id}`}/>
          ))
        }
      </div>

    );
  }
}
