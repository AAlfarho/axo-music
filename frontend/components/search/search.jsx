import React from 'react';
import * as SearchAPIUtil from '../../util/search_api_util';
import UserSongTabs from './user_song_tabs';
import _ from 'lodash';

export default class Search extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      query: '',
      results: {
        songs:{},
        users:{}
      }
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
  }

  componentDidMount(){
    document.getElementById('search-input').focus();
    document.getElementById("search-input")
    .addEventListener("keyup", (event) => {
      event.preventDefault();
      _.debounce(() => this.handleSearch(), 5000);
    });

  }

  handleSearch(){
    SearchAPIUtil.searchFor(this.state.query).then(res => {
      let songs = {};
      let users = {};
      if(res.song_results){
        songs = res.song_results;
      }
      if(res.user_results && res.user_results.user_details){
        users = res.user_results.user_details;
      }
      this.setState({
        results: {
          songs,
          users
        }
      });
    });
  }

  handleSearchInputChange(event){
    event.preventDefault();
    if(!event.target.value){
      this.setState({
        query: '',
        results: {
          songs:{},
          users:{}
        }
      });
    } else {
      this.setState({
        query: event.target.value
      });
    }
  }

  render(){
    const {users, songs} = this.state.results;
    //          <button onClick={this.handleSearch}>temp search</button>
    return(
      <div className="vbox search-root-flex-container">
        <div className="vbox search-input-flex-container">
          <div className="hbox input-label-container">
            Search for song or user
          </div>
          <div className="hbox input-field-container">
            <input id="search-input" onChange={this.handleSearchInputChange}
              className="modal-input-dark" placeholder="Start typing..."
              value={this.state.query}></input>
          </div>
        </div>

        <div className="vbox results-flex-container">
          <div className="hbox reults-categories-flex-container">
            <UserSongTabs users={Object.values(users)} songs={Object.values(songs)} />
          </div>
        </div>
      </div>
    );
  }
}
