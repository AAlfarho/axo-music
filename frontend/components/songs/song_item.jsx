import React from 'react';
import {PLAYLIST_COLLECTION} from '../../util/constants';
import Modal from 'react-modal';
import AddToPlaylistCont from '../playlists/add_to_playlist_container';

const songOptionsModal = {
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
      debugger;
      this.setState((prevState) => {
        debugger;
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
      debugger;
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
    return(
      <Modal
        isOpen = {this.state.deleteSongModalOpen}
        onAfterOpen = {this.toggleSongOptModal}
        onRequestClose = {this.toggleSongOptModal}
        style={songOptionsModal}
        >
        Are you sure you want to delete the song?
        <button onClick={this.handleDeleteSong}> DELETE </button>
      </Modal>
    );
  }

  addToPlaylistModal(){
    return(
      <Modal
        isOpen = {this.state.addSongToCollectionModalOpen}
        onAfterOpen = {this.toggleAddSongModal}
        onRequestClose = {this.toggleAddSongModal}
        style={songOptionsModal}
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
              By: {song.artist_name}
            </div>
            <div className="song-left-details">
              {secondsTimeSpanToHMS(song.length)}
              {
                showDelete &&
                <button onClick={this.toggleSongOptModal}>
                  -
                </button>

              }
              <button onClick={this.toggleAddSongModal}>+</button>
            </div>
          </div>

        </div>


      </div>
    );
  }
}
