import React from 'react';
import {PLAYLIST_COLLECTION} from '../../util/constants';
import Modal from 'react-modal';
import AddToPlaylistCont from '../playlists/add_to_playlist_container';
import {formPLaylistModal}  from '../modal/modal_styles';
// Taken from
//https://stackoverflow.com/questions/11792726/turn-seconds-into-hms-format-using-jquery
function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;
    return (m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on
}
export default class SongItem extends React.Component{
  constructor(props){
    super(props);
    this.handleDeleteSong = this.handleDeleteSong.bind(this);
    this.toggleSongOptModal = this.toggleSongOptModal.bind(this);
    this.toggleAddSongModal = this.toggleAddSongModal.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      deleteSongModalOpen: false,
      addSongToCollectionModalOpen: false
    };
  }

  toggleModal(field){
    return (e) => {
      this.setState((prevState) => {
        return {[field]: !prevState[field]};
      });
    };
  }

  toggleSongOptModal(event){
    if(event){
      event.preventDefault();
      this.setState((prevState) => ({
        deleteSongModalOpen: !prevState.deleteSongModalOpen
      }));
    }
  }

  toggleAddSongModal(event){
    if(event){
      event.preventDefault();
      this.setState((prevState) => ({
        addSongToCollectionModalOpen: !prevState.addSongToCollectionModalOpen
      }));
    }
  }


  handleDeleteSong(e){
    if(this.props.collectionType === PLAYLIST_COLLECTION){
      const songIds = this.props.collection.song_ids;
      const indexToDelete = songIds.indexOf(this.props.song.id);
      if(indexToDelete !== -1){
        songIds.splice(indexToDelete, 1);
        if(songIds.length === 0){
          songIds.push("");
        }
        this.props.updatePlaylist(this.props.collection);
      }
    }
    this.toggleSongOptModal(e);
  }

  songOptionsModal(){
    const {song, collection} = this.props;
    return(
      <Modal
        isOpen = {this.state.deleteSongModalOpen}
        onAfterOpen = {this.toggleSongOptModal}
        onRequestClose = {this.toggleSongOptModal}
        style={formPLaylistModal}
        >
        <div className="vbox delete-playlist-flex-container">
          <div className="new-playlist-title">
            <h1>
              Delete {`'${song.title}'`} from {`'${collection.name}'`}?
            </h1>
          </div>
          <div name="new-playlist-actions">
            <button className="btn-sm btn-xl-create-pl btn-green" onClick={this.handleDeleteSong}>Delete</button>
          </div>
        </div>

      </Modal>
    );
  }

  addToPlaylistModal(){
    return(
      <Modal
        isOpen = {this.state.addSongToCollectionModalOpen}
        onAfterOpen = {this.toggleAddSongModal}
        onRequestClose = {this.toggleAddSongModal}
        style={formPLaylistModal}
        >
        <AddToPlaylistCont song_id={this.props.song.id}/>
      </Modal>
    );
  }

  render(){
    const {collection, song, showDelete} = this.props;
    return (
      <div className="hbox song-item-flex-cotainer">
        {this.songOptionsModal()}
        {this.addToPlaylistModal()}
        <div className="vbox song-detail-items">
          <div className="hbox song-title-container">
            {song.title}
          </div>

          <div className="hbox song-details">
            <div>
              Artist: {song.artist_name}
            </div>
            <div>
              Album: {song.album_name}
            </div>
            <div className="hbox song-left-details">
              {secondsTimeSpanToHMS(song.length)}
              {
                showDelete &&
                <div className="pl-detail-delete-song" onClick={this.toggleSongOptModal}>
                  <i className="fa fa-minus-square"></i>
                </div>
              }
              <div className="pl-detail-add-song" onClick={this.toggleAddSongModal}>
                <i className="fa fa-plus-square"></i>
              </div>
            </div>
          </div>

        </div>


      </div>
    );
  }
}
