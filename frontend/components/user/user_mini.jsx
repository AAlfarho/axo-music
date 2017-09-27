import React from 'react';
import { Link } from 'react-router-dom';
export default class UserMini extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const {user} = this.props;
    return(
      <div className="hbox mini-user-display">
        <div className="vbox user-mini-image">
          <Link to={`/user/${user.id}`}>
            <img src={user.image_url} />
          </Link>
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
