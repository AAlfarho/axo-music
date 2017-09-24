import React from 'react';
import LineSeparator from '../util/line_separator';
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

      <div className="vbox new-playlist-flex-container">
        <div className="new-playlist-title">
          <h1>
            Add to playlist
          </h1>
        </div>
        <div className="new-playlist-input">
            {
              playlists.map(p => {
                return (
                  <div key={`pl-${p.id}`}
                    className="select-playlist-to-add-song"
                    onClick={this.addSongToPlaylist}>
                      <div id={p.id} className="playlist-to-add-name">
                        {p.name}
                      </div>
                    <LineSeparator />
                  </div>
                );
              })
            }
            <div className="hbox song-add-to-pl-res-container">
              <div className="song-add-to-pl-res">
                {this.state.addStatusLabel}
              </div>
            </div>
        </div>
      </div>

    );
  }
}
