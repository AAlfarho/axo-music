import React from 'react';
export default class AddToPlaylistList extends React.Component {
  constructor(props){
    super(props);
    this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
    this.state = {
      addStatusLabel: ""
    };
  }

  addSongToPlaylist(event){
    event.preventDefault();
    const {playlists, song_id} = this.props;
    const selectedPlaylistId = parseInt(event.target.id);
    let playlist;
    playlists.forEach(p => {
      if(p.id === selectedPlaylistId){
        playlist = p;
      }
    });
    playlist.song_ids.push(song_id);
    this.props.updatePlaylist(playlist).
      then(res => this.setState(
        {
          addStatusLabel: `Song added to playlist: \'${playlist.name}\' !`
        })
    );
  }

  render(){
    const {playlists} = this.props;
    return(
      <ul>
        {
          playlists.map(p => {
            return (
              <li key={`pl-${p.id}`} id={p.id} onClick={this.addSongToPlaylist}>
                {p.name}
              </li>
            );
          })
        }
        {this.state.addStatusLabel}
      </ul>

    );
  }
}
