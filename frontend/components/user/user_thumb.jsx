import React from 'react';

export default class UserThumb extends React.Component {
  constructor(props){
    super(props);

    this.handleFollowAction = this.handleFollowAction.bind(this);
    this.handleUnfollowAction = this.handleUnfollowAction.bind(this);
  }

  componentWillMount(){
    if(!this.props.user.username){
      this.props.fetchUser(this.props.user.id);
    }
  }

  handleFollowAction() {
    this.props.friendUser(this.props.user.id);
  }

  handleUnfollowAction(){
    this.props.unfriendUser(this.props.user.id);
  }

  render(){
    const {user, currentUser} = this.props;
    if(!user.username){
      return <div></div>;
    }
    let followButton;
    if(currentUser.id !== user.id){
      if(user.user_friend){
        followButton = (
          <button className="btn-sm btn-white btn-friend"
            onClick={this.handleUnfollowAction}>Unfollow</button>
        );
      } else {
        followButton = (
          <button className="btn-sm btn-green btn-friend"
            onClick={this.handleFollowAction}>Follow</button>
        );
      }
    }

    return(
      <div className="hbox user-thumb-flex-container">
        <div className="vbox user-thumb-image-container" >
          <img src="https://s3-us-west-1.amazonaws.com/aalfarho-axo/images/missing.png" />
        </div>
        <div className="vbox user-thumb-details-container">
          <div className="hbox user-thumb-name-container">
            {user.username}
          </div>
          <div className="hbox user-thumb-actions-cotainer">
            {followButton}
          </div>
        </div>
      </div>
    );
  }


}
