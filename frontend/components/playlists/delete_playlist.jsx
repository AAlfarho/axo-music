import React from 'react';

export default class deletePlaylist extends React.Component {
  constructor(props){
    super(props);
    const {playlist} = this.props;
    this.state = this.props.playlist;
    this.handleDeletePlaylist = this.handleDeletePlaylist.bind(this);
  }

  handleChange(field){
    return (event) => {
      this.setState({
        [field]: event.target.value
      });
    };
  }

  handleDeletePlaylist(){;
    this.props.deletePlaylist(this.state.id).then(
      () => this.props.history.push("/")
    );
  }

  render(){
    const {name} = this.state;
    return(
      <div>
        <p>
          Are you soure you want to delete '{name}' playlist?
        </p>
         <button onClick={this.handleDeletePlaylist}>Continue</button>
      </div>
    );
  }
}
