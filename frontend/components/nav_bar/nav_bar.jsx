import React from 'react';
import { NavLink } from 'react-router-dom';
import LineSeparator from '../util/line_separator';

export default class NavBar extends React.Component {
  constructor(props){
    super(props);

    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);
  }

  handlePlaylistClick(){
    this.props.history.push("/collection/playlists");
  }

  render(){
    return(
      <div className="vbox nav-container">
        <div className="vbox nav-action-container">
          <div className="hbox nav-brand-logo">
            <NavLink to="/">
              <i className="fa fa-spotify fa-2x" ></i>
            </NavLink>
            <div>
              <i className="fa fa-spotifyasd" aria-hidden="true"></i>
            </div>
           </div>
           <LineSeparator />
          <div className="hbox search-container">
            <div className="search-text">
              Search
            </div>
            <div className="search-logo">
              <i className="fa fa-search strong"></i>
            </div>

          </div>
          <LineSeparator />
          <div onClick={this.handlePlaylistClick} className="hbox playlist-container">
              <div>Playlists</div>
              <div>
                <i className="fa fa-music navlink-music-logo"></i>
              </div>
           </div>

        </div>

        <div className="user-container">
          <LineSeparator />
          currentUser comp
          <button onClick={() => this.props.logout()}>log out</button>
        </div>

      </div>
    );
  }
}
