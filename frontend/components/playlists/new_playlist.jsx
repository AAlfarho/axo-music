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
      }
    );
  }

  render(){
    const {playlistName, actionStatus} = this.state;
    return(
      <div>
        New Playlist
        <input type="text" value={playlistName}
           onChange={this.handleChange('playlistName')}
           placeholder="Playlist Name"/>
         <button onClick={this.handlePlaylistCreation}>Create</button>
         {actionStatus}
      </div>
    );
  }
}
