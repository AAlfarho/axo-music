import React from 'react';

const CurrentUser = (props) => (
    <div className="hbox current-user-flex-container">
      <div className="vbox current-user-image">
        <img src={props.currentUser.image_url}/>
      </div>
      <div className="hbox current-user-details">
        <div className="vbox current-user-name">
          {props.currentUser.username}
        </div>
        <div onClick={() => props.logout()}className="vbox current-user-logout-action">
          <i className="fa fa-sign-out fa-2x"></i>
        </div>
      </div>

    </div>
);

export default CurrentUser;
