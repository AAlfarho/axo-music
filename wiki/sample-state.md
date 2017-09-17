# Sample State

```js
{
  entities: {
    songs : {
      1236 : {
        id: 1236,
        title: 'One Another',
        artist: 'Mac Demarco',
        file_path: '/some_path/where/we/can/find/the/song.mp3'
      },
    },
    playlists: {
      1: {
        id: 1,
        body: "Bring back the 90's",
        author_id: 1,
        img_url: "http://maxpixel.freegreatpicture.com/static/photo/1x/Wildlife-Tropical-Pet-Colorful-Macaw-Parrot-Bird-410144.jpg"
      },
      2: {
        id: 2,
        body: "This is Real Estate",
        author_id: 2,
        img_url: "http://maxpixel.freegreatpicture.com/static/photo/1x/Wildlife-Tropical-Pet-Colorful-Macaw-Parrot-Bird-410144.jpg"
      },
      3: {
        id: 3,
        body: "This is Molotov",
        author_id: 3,
        img_url: "http://maxpixel.freegreatpicture.com/static/photo/1x/Wildlife-Tropical-Pet-Colorful-Macaw-Parrot-Bird-410144.jpg",
      }
    },
    users: {
      2: {
        id: 2,
        username: "friend_1",
        img_url: "http://maxpixel.freegreatpicture.com/static/photo/1x/Wildlife-Tropical-Pet-Colorful-Macaw-Parrot-Bird-410144.jpg",
      }
      3: {
        id: 3,
        username: "friend_2",
        img_url: "https://cdn.pixabay.com/photo/2013/11/03/14/56/bird-204842_960_720.jpg",
      }
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
      username: "blue_hawk",
      img_url: "https://cdn.pixabay.com/photo/2013/12/29/03/47/hawk-234999_960_720.jpg",
      playlists_ids : [1,2,3],
      following_ids : [2,3]
    }
  },
  playback = {
    currentlyPlayingID = 1236,
    queue_track_ids = [54,284,485],
    current
  }
}
```
