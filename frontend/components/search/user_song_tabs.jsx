import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SongIndexContainer from '../songs/song_index_container';
import UserMini from '../user/user_mini';
import NoResult from './no_result';
import {
  SEARCH_COLLECTION
} from '../../util/constants';
const UserSongTabs = (props) => {
    const searchCollection= {
      name: 'Search'
    };
    let songsResults = (<NoResult property="song" />);
    let usersResults = (<NoResult property="user" />);
    if(props.songs.length){
      songsResults = (
        <SongIndexContainer
          collectionType={SEARCH_COLLECTION}
          songs={props.songs}
          showDelete={false}
          collection={searchCollection}
          />
      );
    }

    if(props.users.length){
      usersResults = (
        props.users.map(user => <UserMini key={`user-id-${user.id}`} user={user} />)
      );
    }
    return(
      <Tabs className="vbox tab-flex-container">
          <TabList className="hbox tab-title-flex-container">
              <Tab className="vbox tab-title-item">Songs</Tab>
              <Tab className="vbox tab-title-item">Users</Tab>
          </TabList>
        <div className="result-tab-panel-flex">
          <TabPanel className="songs-result-tab">
            {
              songsResults
            }
          </TabPanel>
          <TabPanel className="hbox users-result-tab">
            {
              usersResults
            }
          </TabPanel>
        </div>
      </Tabs>
    );
};

export default UserSongTabs;
