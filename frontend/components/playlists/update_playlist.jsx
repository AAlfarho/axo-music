import React from 'react';
import merge from 'lodash/merge';

export default class UpdatePlaylist extends React.Component {
  constructor(props){
    super(props);
    const {playlist} = this.props;
    this.state = {
        playlist,
        actionStatus: ''
    };
    this.handlePlaylistUpdate = this.handlePlaylistUpdate.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  handleTitleChange(event){
      event.preventDefault();
      const val = event.target.value;
      const newState = merge({}, this.state);
      newState.playlist.name = val;
      this.setState(newState);
  }

  handlePlaylistUpdate(){
    const {playlist} = this.state;
    this.props.updatePlaylist(this.state.playlist).fail( errors => {
      this.setState({
        actionStatus: errors.errors
      });
    });
  }

  render(){
    const {playlist, actionStatus} = this.state;
    return(
      <div className="vbox new-playlist-flex-container">
        <div className="new-playlist-title">
          <h1>
            Update Playlist
          </h1>
        </div>
        <div className="new-playlist-input">
          <input type="text" className="modal-input-dark" value={playlist.name}
            onChange={this.handleTitleChange}
            placeholder="Start typing..."/>
        </div>
        <div name="new-playlist-actions">
          <button className="btn-sm btn-xl-create-pl btn-green" onClick={this.handlePlaylistUpdate}>Update</button>
        </div>
        <div className="update-playlist-res">
          {actionStatus}
        </div>
      </div>
    );
  }
}
