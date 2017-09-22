import React from 'react';
import MediaInfoItem from '../media_info/media_info_item';

export default class PlaylistIndex extends React.Component{
  constructor(props){
    super(props);
    this.handlePlaylistUserFetching = this.handlePlaylistUserFetching.bind(this);
    this.handleDeleteSong = this.handleDeleteSong.bind(this);
  }

  componentDidMount(){
    // const {userId, currentUser} = this.props;
    // if(userId === currentUser.id){
    //   this.props.fetchPlaylists();
    // }
  }

  componentWillReceiveProps(newProps){
    //this.handlePlaylistUserFetching(newProps);
  }

  handlePlaylistUserFetching(propsToUse){
    const {playlist} = propsToUse;
    if(!playlist){
      this.props.fetchPlaylists(propsToUse.match.params.playlistId);
    }
  }
  handleDeleteSong(e){
    const songIds = this.props.playlist.song_ids;
    const indexToDelete = songIds.indexOf(parseInt(e.target.value));
    if(indexToDelete !== -1){
      songIds.splice(indexToDelete, 1);
      this.props.updatePlaylist(this.props.playlist);
    }

  }

  render(){
    const {playlist, songs} = this.props;
    return(
      <div style={{padding: '30px'}}>
        <MediaInfoItem img_url={playlist.image_url} media_name={playlist.name}
              media_author={playlist.author_id}
              detail_url={`/user/${playlist.author_id}/playlist/${playlist.id}`}/>
            <ol>
            {
              Object.values(songs).map(song => (
                <li>
                  {song.title}
                  <ul>
                    <li>{song.length}</li>
                    <li>{song.artist_name}</li>
                    <li>{song.album_name}</li>
                    <button value={song.id} onClick={this.handleDeleteSong}> Delete</button>
                  </ul>
                </li>
              ))
            }
          </ol>
      </div>

    );
  }
}
