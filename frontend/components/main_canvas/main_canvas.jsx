import React from 'react';
import NavBarContainer from '../nav_bar/nav_bar_container';
import MainPlayground from '../main_playground/main_playground';

export default class MainCanvas extends React.Component {
    constructor(props){
      super(props);
    }
    componentDidMount(){
      if(this.props.location.pathname === "/"){
        this.props.history.push('/collection/playlists');
      }
    }

    render(){
      return(
        <div className="vbox viewport main-container">
          <section className="main-section-flex-container">
            <nav className="nav-bar-flex-item">
              <NavBarContainer />
            </nav>
            <article className="main-playground-flex-item">
              <MainPlayground />
            </article>
          </section>
          <footer className="media-player-flex-item">
            media player
          </footer>
        </div>
      );
    }
}
