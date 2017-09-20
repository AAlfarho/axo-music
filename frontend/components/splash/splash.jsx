import React from 'react';
import {Link} from 'react-router-dom';

const Splash = (props) => (
<div className="splash">
  <div className="hero-image">
    <div className="splash-wrapper">
      <div className="display-options">
        <div className="left-most-options">
          <div className="small-logo">
            <img alt="" src="https://open.scdn.co/static/images/logo-white-2x.png"/>
          </div>
          <button id="signup-spotify" className="btn-xl btn-green" data-or="or" data-contextual="false">
            <Link to={props.signup_url}>
              Sign Up
            </Link>
          </button>
          <div className="separator-container">
            <div className="separator-line"></div>
            <div className="separator-line">
            </div>
          </div>
        <button className="btn btn-xl btn-white" data-or="or">
            <Link to={props.login_url}>
              Login
            </Link>
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

export default Splash;
