import React from 'react';
import Modal from 'react-modal';
import MediaInfoItem from '../media_info/media_info_item';
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



  componentDidMount(){
    this.props.fetchPlaylist(this.props.match.params.playlistId);
  }

  componentWillReceiveProps(newProps){
    const currId = this.props.match.params.playlistId;
    const newId = newProps.match.params.playlistId;
    if(currId && newId && currId !== newId){
      this.props.fetchPlaylist(newProps.match.params.playlistId);
    }
    this.setState({
      udpatePlaylistModalOpen: false,
      deletePlaylistModalOpen: false
    });

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
    return(
      <div className="hbox playlist-detail-flex-container">
        <div className="vbox playlist-media-info-container">
          <MediaInfoItem img_url={playlist.image_url} media_name={playlist.name}
              media_author={playlist.author_id} media_author_name={playlist.author_name}
              detail_url={`/user/${playlist.author_id}/playlist/${playlist.id}`}/>
            {this.updatePlaylistModal()}
            {this.deletePlaylistModal()}
            {
              playlist.user_owns &&
              <div className="hbox playlist-owner-actions">
                <button className="btn-sm btn-green btn-owner-actions-pl"
                  onClick={this.toggleUpdatePlaylistModal}>Update</button>
                <button className="btn-sm btn-white btn-owner-actions-pl"
                  onClick={this.toggleDeletePlaylistModal}>Delete</button>
              </div>
            }

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
        >
        <DeletePlaylist history={this.props.history} deletePlaylist={this.props.deletePlaylist} playlist={this.props.playlist}/>
      </Modal>
    );
  }
}
