import React from 'react';

export default class UpdatePlaylist extends React.Component {
  constructor(props){
    super(props);
    const {playlist} = this.props;
    this.state = this.props.playlist;
    this.handlePlaylistUpdate = this.handlePlaylistUpdate.bind(this);
  }

  handleChange(field){
    return (event) => {
      this.setState({
        [field]: event.target.value
      });
    };
  }

  handlePlaylistUpdate(){
    const {playlist} = this.state;
    this.props.updatePlaylist(this.state);
  }

  render(){
    const {name, actionStatus} = this.state;
    return(
      <div className="vbox new-playlist-flex-container">
        <div className="new-playlist-title">
          <h1>
            Update Playlist
          </h1>
        </div>
        <div className="new-playlist-input">
          <input type="text" className="modal-input-dark" value={name}
            onChange={this.handleChange('name')}
            placeholder="Start typing..."/>
        </div>
        <div name="new-playlist-actions">
          <button className="btn-sm btn-xl-create-pl btn-green" onClick={this.handlePlaylistUpdate}>Update</button>
        </div>
        <div className="new-playlist-res">
          {actionStatus}
        </div>
      </div>
    );
  }
}
