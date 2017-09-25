import React from 'react';
import Modal from 'react-modal';
import MediaInfoContainer from '../media_info/media_info_item_container';
import NewPlaylist from '../playlists/new_playlist';
import {formPLaylistModal}  from '../modal/modal_styles';

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
    if(newProps.errors.length === 0){
        this.setState({newPlaylistModalOpen: false});
    }
  }

  handlePlaylistUserFetching(propsToUse){
    const {userId, currentUser} = propsToUse;
    if(userId !== currentUser.id && this.props !== propsToUse){
      this.props.fetchPlaylists();
    }
  }

  render(){
    return(
      <div className="vbox viewport playlist-index-container">
        <div className="hbox header-container">
          <div className="collection-playlists-header">
            <h1>
              Playlists
            </h1>
          </div>
          <div className="new-playlist-btn-container">
            <button className="btn-sm btn-green btn-new-pl" onClick={this.toggleNewPlaylistModal}> New Playlist </button>
          </div>
        </div>


        {this.newPlaylistModal()}
        <div className="hbox collection-playlist-container">
          {
            this.props.playlists.map(playlist => (
              <div className="playlist-media-info-item" key={playlist.id}>
                <MediaInfoContainer key={`med-inf-${playlist.id}`} collection={playlist}/>
            </div>
            ))
          }
        </div>

      </div>

    );
  }

  newPlaylistModal(){
    return(
      <div>
        <Modal
          isOpen = {this.state.newPlaylistModalOpen}
          onAfterOpen = {this.toggleNewPlaylistModal}
          onRequestClose = {this.toggleNewPlaylistModal}
          style={formPLaylistModal}
          contentLabel= "new-playlist"
          >
          <NewPlaylist createPlaylist={this.props.createPlaylist}/>
        </Modal>
      </div>
    );
  }

}
