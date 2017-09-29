import React from 'react';
import Modal from 'react-modal';
import MediaInfoContainer from '../media_info/media_info_item_container';
import SongIndexContainer from '../songs/song_index_container';
import {PLAYLIST_COLLECTION} from '../../util/constants';
import {formPLaylistModal} from '../modal/modal_styles';
import UpdatePlaylist from './update_playlist';
import DeletePlaylist from './delete_playlist';


export default class PlaylistIndex extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      udpatePlaylistModalOpen: false,
      deletePlaylistModalOpen: false
    };

    this.toggleUpdatePlaylistModal = this.toggleUpdatePlaylistModal.bind(this);
    this.toggleDeletePlaylistModal = this.toggleDeletePlaylistModal.bind(this);
  }



  componentWillMount(){
    this.props.fetchPlaylist(this.props.match.params.playlistId);
  }

  componentWillReceiveProps(newProps){
    const currId = this.props.match.params.playlistId;
    const newId = newProps.match.params.playlistId;
    if(currId && newId && currId !== newId){
      this.props.fetchPlaylist(newProps.match.params.playlistId);
    }
    if(newProps.state.errors.playlist.length === 0){
      this.setState({
        udpatePlaylistModalOpen: false,
        deletePlaylistModalOpen: false
      });
    }


  }

  toggleUpdatePlaylistModal(event){
    if(event){
      event.preventDefault();
      this.setState((prevState) => ({
        udpatePlaylistModalOpen: !prevState.udpatePlaylistModalOpen
      }));
    }
  }

  toggleDeletePlaylistModal(event){
    if(event){
      event.preventDefault();
      this.setState((prevState) => ({
        deletePlaylistModalOpen: !prevState.deletePlaylistModalOpen
      }));
    }
  }

  render(){
    const {playlist, songs} = this.props;
    let buttonsToDisplay;
    if(playlist.user_owns){
      buttonsToDisplay = (
        <div className="hbox playlist-owner-actions">
          <button className="btn-sm btn-green btn-owner-actions-pl"
          onClick={this.toggleUpdatePlaylistModal}>Rename</button>
          <button className="btn-sm btn-white btn-owner-actions-pl"
          onClick={this.toggleDeletePlaylistModal}>Delete</button>
        </div>
      );
    } else {
      if(!playlist.user_follows){
        buttonsToDisplay = (<div className="hbox playlist-followee-actions">
          <button className="btn-sm btn-green btn-owner-actions-pl"
          onClick={() => this.props.followPlaylist(playlist.id)}>Follow</button>
      </div>);
      } else {
      buttonsToDisplay = (
        <div className="hbox playlist-followee-actions">
          <button className="btn-sm btn-white btn-owner-actions-pl"
            onClick={() => this.props.unfollowPlaylist(playlist.id)}>Unfollow</button>
        </div>
      ) ;
      }
    }
    return(
      <div className="hbox playlist-detail-flex-container">
        <div className="vbox playlist-media-info-container">
          <MediaInfoContainer collection={playlist}/>
            {this.updatePlaylistModal()}
            {this.deletePlaylistModal()}
            {buttonsToDisplay}

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


  updatePlaylistModal(){
    return(
      <Modal
        isOpen = {this.state.udpatePlaylistModalOpen}
        onAfterOpen = {this.toggleUpdatePlaylistModal}
        onRequestClose = {this.toggleUpdatePlaylistModal}
        style={formPLaylistModal}
        contentLabel="update-pl"
        >
        <UpdatePlaylist updatePlaylist={this.props.updatePlaylist} playlist={this.props.playlist}/>
      </Modal>
    );
  }

  deletePlaylistModal(){
    return(
      <Modal
        isOpen = {this.state.deletePlaylistModalOpen}
        onAfterOpen = {this.toggleDeletePlaylistModal}
        onRequestClose = {this.toggleDeletePlaylistModal}
        style={formPLaylistModal}
        contentLabel="delete-song-from-pl"
        >
        <DeletePlaylist history={this.props.history} deletePlaylist={this.props.deletePlaylist} playlist={this.props.playlist}/>
      </Modal>
    );
  }
}
