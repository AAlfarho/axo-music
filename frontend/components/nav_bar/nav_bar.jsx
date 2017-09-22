import React from 'react';

export default class NavBar extends React.Component {
  constructor(props){
    super(props);
  }


  render(){
    return(
      <div className="vbox nav-container">
        <div className="brand-logo"> logo </div>
        <div className="search-container"> search</div>
        <div className="playlist-container"> playlsits </div>
        <div className="user-container"> currentUser comp </div>
        <button onClick={() => this.props.logout()}>log out</button>
      </div>
    );
  }
}
