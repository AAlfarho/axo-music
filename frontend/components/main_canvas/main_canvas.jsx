import React from 'react';

export default class MainCanvas extends React.Component {
    constructor(props){
      super(props);
    }

    render(){
      return(
        <div>
          <h1>Main Container</h1>
          <button onClick={()=> this.props.logout()}>Temp logout</button>
        </div>
      );
    }
}
