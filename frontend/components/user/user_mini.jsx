import React from 'react';

export default class UserMini extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const {user} = this.props;
    return(
      <div className="hbox mini-user-display">
        <div className="vbox user-mini-image">
          <img src={user.image_url} />
        </div>
        <div className="vbox user-mini-details">
          <div className="user-mini-username">
            {user.username}
          </div>
          <div className="user-mini-pl-details">
            Number of playlists: {user.playlists_ids.length}
          </div>
        </div>

      </div>
    );
  }
}
