import React from 'react';
import {Link} from 'react-router-dom';

const Splash = (props) => (
<div className="splash">
  <div id="bg-wrap" className="loaded">
    <div id="login">
      <div id="login-method">
        <div className="step show" id="screen-signup-flow">
          <div className="step-outer">
            <div className="step-inner">
              <div className="heading logo">
                <img alt="" src="https://open.scdn.co/static/images/logo-white-2x.png"/>
              </div>
              <button id="signup-spotify" className="btn-landing btn-green" data-or="or" data-contextual="false">
                <Link to={props.signup_url}>
                  Sign Up
                </Link>
              </button>
              <div className="separator-container">
                <div className="separator-line"></div>
                <div className="separator-text">¿Ya tienes cuenta?</div>
                <div className="separator-line">
                </div>
              </div>
              <button id="has-account" className="btn-landing btn-white" data-or="or">
                <Link to={props.login_url}>
                  Login
                </Link>
              </button>
            </div>
          </div>
        </div>

        <div id="login-features">
          <h1>Consigue la música perfecta</h1>
          <h3>Escucha millones de canciones gratis.</h3>
          <ul>
            <li>Busca y descubre música que te encantará</li>
            <li>Crea playlists con tu música favorita</li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</div>
);

export default Splash;
