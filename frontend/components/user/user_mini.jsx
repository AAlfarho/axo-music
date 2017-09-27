import React from 'react';

export default class UserMini extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const {user} = this.props;
    return(
      <div>
        {user.username}
        Number of playlists: {user.playlists_ids.length}
        {user.image_url}
      </div>
    );
  }
}
