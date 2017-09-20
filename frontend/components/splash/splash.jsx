import React from 'react';
import {Link} from 'react-router-dom';

export default class Splash extends React.Component {
  constructor(props){
    super(props);

    this.redirectToLogin = this.redirectToLogin.bind(this);
    this.redirectToSignup = this.redirectToSignup.bind(this);
  }

  redirectToLogin(){
    this.props.history.push(this.props.login_url);
  }

  redirectToSignup(){
    this.props.history.push(this.props.signup_url);

  }

  render(){
    return(
      <div className="splash">
        <div className="hero-image">
          <div className="splash-wrapper">
            <div className="display-options">
              <div className="left-most-options">
                <div className="small-logo">
                  <img alt="" src="https://open.scdn.co/static/images/logo-white-2x.png"/>
                </div>
                <button id="signup-spotify" className="btn btn-xl btn-green"
                  onClick={this.redirectToSignup} >
                  Sign Up
                </button>
                <div className="separator-container">
                  <div className="separator-line"></div>
                  <div className="separator-line">
                  </div>
                </div>
              <button className="btn btn-xl btn-white"
                onClick={this.redirectToLogin}>
                Login
              </button>
              </div>
              <div className="right-most-options">
                <h1 className="green-h1">Get the right music, right now</h1>
                <h3>Listen to millions of songs for free.</h3>
                <ul>
                  <li>Search &amp; discover music you'll love</li>
                  <li>Create playlists of your favorite music</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
