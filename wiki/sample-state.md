# Sample State

```js
{
  entities: {
    songs : {
      15 : {
        id: 15,
        title: 'One Another',
        artist: 'Mac Demarco',
        file_path: '/some_path/where/we/can/find/the/song.mp3'
      },
      43 : {
        id: 43,
        title: 'Gimme Tha Power',
        artist: 'Molotov',
        file_path: '/some_path/where/we/can/find/the/song.mp3'
      },
      234 : {
        id: 234,
        title: 'Gimme Tha Power',
        artist: 'Molotov',
        file_path: '/some_path/where/we/can/find/the/song.mp3'
      },
      33 : {
        id: 33,
        title: 'Primitive',
        artist: 'Real Estate',
        file_path: '/some_path/where/we/can/find/the/song.mp3'
      },
      all_ids: [15,43,234,33]
    },
    playlists: {
      1: {
        id: 1,
        body: "Bring back the 90's",
        author_id: 1,
        img_url: "/some_path/where/we/can/find/the/playlist/artwork",
        song_ids: [43,15]
        current_user_follows: true,
        current_user_owns: true,
      },
      2: {
        id: 2,
        body: "This is Real Estate",
        author_id: 2,
        img_url: "/some_path/where/we/can/find/the/playlist/artwork",
        song_ids: [33]
        current_user_follows: true,
        current_user_owns: false,
      },
      3: {
        id: 3,
        body: "This is Molotov",
        author_id: 3,
        img_url: "/some_path/where/we/can/find/the/playlist/artwork",
        song_ids: [43]
        current_user_follows: true,
        current_user_owns: false,
      },
      all_ids: [1,2,3]
    },
    users: {
      2: {
        id: 2,
        username: "friend_1",
        img_url: "/some_path/where/we/can/find/the/user/avatar",
        current_user_follows: true
      }
      3: {
        id: 3,
        username: "friend_2",
        img_url: "/some_path/where/we/can/find/the/user/avatar",
        current_user_follows: true
      },
      all_ids: [2,3]
    }
  },
  ui: {
    loading: true/false
  },
  errors: {
    login: ["Incorrect username/password combination"],
    media_player: ["Error while reproducing song."]

  },
  session: {
    currentUser: {
      id: 57,
      username: "alfaro",
      img_url: "/some_path/where/we/can/find/the/user/avatar",
      playlists_ids : [1,2,3]
    }
  },
  playback = {
    currentlyPlayingID = 15,
    queue_track_ids = [54,284,485],
    current_playback_time: 23,
    status: "PAUSED", // [PAUSED, PLAYING, BUFFERING]
  }
}
```
