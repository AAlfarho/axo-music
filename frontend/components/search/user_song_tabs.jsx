import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SongIndexContainer from '../songs/song_index_container';
import UserMini from '../user/user_mini';
import {
  SEARCH_COLLECTION
} from '../../util/constants';
const UserSongTabs = (props) => {
    const searchCollection= {
      name: 'Search'
    };
    return(
      <Tabs>
        <TabList>
          <Tab>Songs</Tab>
          <Tab>User</Tab>
        </TabList>

        <TabPanel>
          <SongIndexContainer
            collectionType={SEARCH_COLLECTION}
            songs={props.songs}
            showDelete={false}
            collection={searchCollection}
            />
        </TabPanel>
        <TabPanel>
          {
            props.users.map(user => <UserMini user={user} />)
          }
        </TabPanel>
      </Tabs>
    );
};

export default UserSongTabs;
