# React Component Hierarchy

## Functional Component Hierarchy
+ `Root`
  + `App`
    + `NavBar`
    + `MainComponent`
    + `MediaPlayer`

## NavBar
+ `NavBar`
  + Components:
    + `Logo link`
    + `Search link`
    + `Playlists link`
    + `CurrentUserContainer` + `CurrentUser`
      + State: `session`

**Note:** All other components are rendered inside of `MainComponent`

---

## Playlists
### Index current user playlists
+ `CollectionPlaylist`
+ Components:
  + `CollectionPlaylistContainer` + `CollectionPlaylistIndex`
    + Route: `/#/collection/playlists`
    + State: `playlists`, `session`
    + Components:
      + `MediaInfoDisplay`
        + State: `playlist[:id]`, `ui`

### Show playlist
+ `ShowPlaylistContainer` + `PlaylistShow`
  + Route: `/#/user/:userID/playlists/:playlistID`
  + State: `playlists[:id], users[:id]`
  + Components:
      + `PlaylistInfoDisplay`
        + State: `playlist[:id]`, `ui`
      + `CollectionSong`
      + State: `playlist[:id]``, `songs`
      + Components:
        + `CollectionSongContainer` + `CollectionSongIndex`
          + State: playlist[:id], `songs[]`
          + Components:
            + `SongInfoDisplay`
              + State: `playlist[:id]`, `songs[:id]`, users[:id]

### Update playlist name
+ `PlaylistForm`
  + Route: `/#/playlist/:playlistID/edit`
  + State: `playlist[:id]`

### Adding song to playlist
+ `PlaylistSelectorIndex`
  + State: `playlists`, `user[:id]`

---

## Search

+ `SearchIndexContainer` + `SearchIndex`
+ Route: `/#/search/`
+ State: `ui`
+ Components:
  + `ResultInfoDisplay`
  + State: none (will be made with separate ajax)
    + Components
      + `CollectionPlaylist`, same component used on the homepage with different playlists.
      + `CollectionSong`, in this scenario we wont have a `playlist[:id]` meaning the songs will not have the remove from playlist option. This is the same component we use on the show playlist.
      + `CollectionFriends`

---

## Profile
+ `UserProfileContainer` + `UserProfile`
  + Route: `/#/users/:userId`
  + State: `playlists`, `users`
  + Components:
    + `CollectionPlaylist`
    + `CollectionFriends`

---

## Session
+ `SessionFormContainer` + `SessionForm`
  + Route: `/#/login` and `/#/signup`
  + State: `errors.login`
