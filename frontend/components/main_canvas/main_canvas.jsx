import React from 'react';

export default class MainCanvas extends React.Component {
    constructor(props){
      super(props);
    }

    render(){
      return(
        <div className="vbox viewport main-container">
          <section className="main-section-flex-container">
            <nav className="nav-bar-flex-item">
              Side nav bar
            </nav>
            <article className="main-playground-flex-item">
              main display component
            </article>
          </section>
          <footer className="media-player-flex-item">
            media player
          </footer>
        </div>
      );
    }
}
