import React from 'react';

export default class NewPlaylist extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      playlistName: '',
      actionStatus: ''
    };
    this.handlePlaylistCreation = this.handlePlaylistCreation.bind(this);
  }

  handleChange(field){
    return (event) => {
      this.setState({
        [field]: event.target.value
      });
    };
  }

  handlePlaylistCreation(){
    const {playlistName} = this.state;
    this.props.createPlaylist({
      name: playlistName
    }).then(
      res => {
        this.setState({
          actionStatus: `Playlist \'${playlistName}\' created! `
        });
      },
      errors => {
        this.setState({
          actionStatus:  errors.errors
        });
      }
    );
  }

  render(){
    const {playlistName, actionStatus} = this.state;
    return(
      <div className="vbox new-playlist-flex-container">
        <div className="new-playlist-title">
          <h1>
            Create new playlist
          </h1>
        </div>
        <div className="new-playlist-input">
          <input type="text" className="modal-input-dark" value={playlistName}
            onChange={this.handleChange('playlistName')}
            placeholder="Start typing..."/>
        </div>
        <div name="new-playlist-actions">
          <button className="btn-sm btn-xl-create-pl btn-green" onClick={this.handlePlaylistCreation}>Create</button>
        </div>
        <div className="new-playlist-res">
          {actionStatus}
        </div>
      </div>
    );
  }
}
