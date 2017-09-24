import React from 'react';
import ReactPlayer from 'react-player';

export default class NavBar extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div>
        <ReactPlayer url='https://s3.amazonaws.com/aalfarho-axo-dev/band/diiv/is_there_is_are/06_Track_6.mp3' playing/>
      </div>
    );
  }
}
