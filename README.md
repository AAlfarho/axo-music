# AXO-MUSIC

[Live demo!](https://axo-music.herokuapp.com)

AXO-MUSIC is a digital music platform inspired by Spotify. It delivers a media experience through technologies like Rails, PostgreSQL, React.js, Redux and AWS S3 storage.
The project was designed and implemented from scratch over a 10 day time-frame. Current version of the platform provides a __lite__ range of features, over time more features will be added.

 ## Features

+ Backend to frontend secure user authentication.
  + User's passwords salted by BCrypt.
  + Users can log with either their username or email.
+ Create your own playlists to be shared with the world.
+ Explore and follow playlists of other users.
+ Continuous playback of your selected collection while navigating through the site.


 ## Playlist CRUD

  ![playlist-crud](https://raw.githubusercontent.com/AAlfarho/axo-music/master/readme/pl-crud.gif)

 ### Continuous media playback
 The heart of any media application is they playback of its resources without disruption. To achieve such goal a slice of the application state was designed for this sole purpose.
 By clicking on the playlist image, the media player will start playing all of the songs from the clicked playlist.

 ```javascript
   playback: {
        collection: {collection_info...},
        queue: [song_id_1, song_id_2, song_id_3]
   }
 ```

 Aside from a specific slice of the application state that will be fed as prop to the **Media Player**, the component will handle its own state and will be responsible for:
 + Playing the next song in the queue if the current song finished playing.
 + Skip to the next song if the *step forward* button is clicked, only if there are more songs in the queue, otherwise the media player will stop playing, as it finished the song queue.
 + Start playing the current song from scratch if the *step backward* is clicked 3 seconds after the current song started playing, this gives the media player a more intuitive feeling. This means we can only play the previous song by clicking *step backward* within the first 3 seconds of the media playing.
 + Volume range keeps track of the volume before and after mute, this, so that after un-muting, the volume is the same as before muting.


 ![collection-play](https://raw.githubusercontent.com/AAlfarho/axo-music/master/readme/play-collection.gif)

Having this slice, will allow future enhancements to reproduce not only **playlist** collections, but *radio* or *album* collection.


 ## Search, keeping it DRY

 Searching is a core feature that enables users to add songs to their playlists as easy as looking for either artist, album or song title. The same search is used for users.

 The **Search** component is not managed by the Redux cycle, it is an independent component that holds its own state, by doing this we avoid overcomplicating our application state and rely completely on our Ajax call to our *REST Endpoint*.
 Always taking into account our **separation of concerns** as a design principle.

 ![search](https://raw.githubusercontent.com/AAlfarho/axo-music/master/readme/search.gif)

 There are a lot of similarities in the way that the songs are displayed in both the *Playlist Details* and in the *Search Results*, and that is because they are the **same** component.

 **DONT REPEAT YOURSELF**

 ```javascript
   import {
     SEARCH_COLLECTION
   } from '../../util/constants';

      ....

   <SongIndexContainer
     collectionType={SEARCH_COLLECTION}
     songs={props.songs}
     showDelete={false}
     collection={searchCollection}
       />
 ```


 Playlist Detail Component

 ![pl-detail](https://raw.githubusercontent.com/AAlfarho/axo-music/master/readme/pl-details.png)

 Search results (songs)

 ![pl-detail](https://raw.githubusercontent.com/AAlfarho/axo-music/master/readme/search-songs-res.png)

 By modularizing the application and separating the concerns properly, we are able to reuse a *Redux* managed component in an *_independent_* component such as the Search.
 Further, this same component could be re-used to display any other type of collections (yet to be impoemented) such as:
  + ALBUM_COLLECTION : all songs from an album.
  + RADIO_COLLECTION : all songs included in a radio.
  + ARTIST_COLLECTION : all songs from a specific artist.


  ### Search fire up event

  For this application, we should not fire up search events every single time the user inputs a new value in our search, we should wait until the user has finished typing and then fire up our search, this is overall a better  approach for our application performance, keeping it simple and don't requesting information when we don't need it.

  To accomplish the above a simple line of 'lodash' is required, **_debounce_** enables us to group sequential calls into a single call, which will be executed after the specified delay time.

   ```javascript

    document.getElementById('search-input').addEventListener('keyup', _.debounce(this.handleSearch, 500) )
   ```

 ### Song ordering

 The order in which a song is inserted in a playlist is extremely important, retrieving them in the same order in which they were inserted into the playlist was a matter of updating our *Model Relationship* in our backend.

 ```ruby
 class Playlist < ApplicationRecord
   ....
   has_many :playlist_song_memberships, -> {order('playlist_songs.created_at asc')},
   primary_key: :id,
   foreign_key: :playlist_id,
   class_name: :PlaylistSong
  ....
  end
 ```
 The above order specified in our *has_many* ActiveRecord class allows us to retrieve songs in the order in which they where inserted in the join table.


## Improvements

- [ ] Click on a song to play it.
- [ ] Show album's / artist's song.
- [ ] Recently played collections display on nav bar.
- [ ] User feed, user followship is already handled, the summary of the user's friends is yet to be implemented.
- [ ] Allow user to use the progress bar and jump to a specific section of a song, implementation for such feature is available under an input range tag. Overlap it to the current progress element.
- [ ] Allow user to click on the *current song being played* and redirect them to either the song, album or artist.
