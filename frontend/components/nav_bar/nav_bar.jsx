import React from 'react';
import { NavLink } from 'react-router-dom';
import LineSeparator from '../util/line_separator';
import CurrentUser from '../user/current_user';
import About from '../about/about';

export default class NavBar extends React.Component {
  constructor(props){
    super(props);

    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  handlePlaylistClick(){
    this.props.history.push("/collection/playlists");
  }

  handleSearchClick(){
    this.props.history.push('/search/');
  }

  render(){
    const {currentUser} = this.props;
    return(
      <div className="vbox nav-container">
        <div className="vbox nav-action-container">
          <div onClick={this.handlePlaylistClick} className="hbox nav-brand-logo">
              <i className="fa fa-spotify fa-2x" ></i>
            <div>
              <i className="fa fa-spotifyasd" aria-hidden="true"></i>
            </div>
          </div>
           <LineSeparator />
          <div onClick={this.handleSearchClick} className="hbox search-container">
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

        <LineSeparator />
        <div className="vbox about-me">
              <About />
        </div>

        <LineSeparator />
        <div className="vbox user-container">
          <CurrentUser currentUser={currentUser} logout={this.props.logout}/>
        </div>

      </div>
    );
  }
}
