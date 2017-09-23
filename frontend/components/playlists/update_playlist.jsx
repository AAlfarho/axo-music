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
    const {name} = this.state;
    return(
      <div>
        Update Playlist
        <input type="text" value={name}
           onChange={this.handleChange('name')}/>
         <button onClick={this.handlePlaylistUpdate}>Create</button>
      </div>
    );
  }
}
