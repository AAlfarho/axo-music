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

  handleDeletePlaylist(){
    this.props.deletePlaylist(this.state.id).then(
      () => this.props.history.push("/")
    );
  }

  render(){
    const {name} = this.state;
    return(
        <div className="vbox delete-playlist-flex-container">
          <div className="new-playlist-title">
            <h1>
              Delete '{name}' playlist?
            </h1>
          </div>
          <div name="new-playlist-actions">
            <button className="btn-sm btn-xl-create-pl btn-green" onClick={this.handleDeletePlaylist}>Delete</button>
          </div>
        </div>
    );
  }
}
