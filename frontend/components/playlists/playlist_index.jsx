import React from 'react';
import Modal from 'react-modal';
import MediaInfoItem from '../media_info/media_info_item';
import NewPlaylist from '../playlists/new_playlist';

const newPLaylistModal = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default class PlaylistIndex extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      newPlaylistModalOpen: false
    };
    this.handlePlaylistUserFetching = this.handlePlaylistUserFetching.bind(this);
    this.toggleNewPlaylistModal = this.toggleNewPlaylistModal.bind(this);
  }

  toggleNewPlaylistModal(event){
    if(event){
      event.preventDefault();
      this.setState((prevState) => ({
        newPlaylistModalOpen: !prevState.newPlaylistModalOpen
      }));
    }
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
        <button onClick={this.toggleNewPlaylistModal}> New Playlist </button>
        {this.newPlaylistModal()}
        {
          this.props.playlists.map(playlist => (
            <MediaInfoItem key={`med-inf-${playlist.id}`}img_url={playlist.image_url} media_name={playlist.name}
              media_author={playlist.author_id} media_author_name={playlist.author_name} detail_url={`/user/${this.props.userId}/playlist/${playlist.id}`}/>
          ))
        }
      </div>

    );
  }

  newPlaylistModal(){
    return(
      <Modal
        isOpen = {this.state.newPlaylistModalOpen}
        onAfterOpen = {this.toggleNewPlaylistModal}
        onRequestClose = {this.toggleNewPlaylistModal}
        style={newPLaylistModal}
        >
        <NewPlaylist createPlaylist={this.props.createPlaylist}/>
      </Modal>
    );
  }

}
