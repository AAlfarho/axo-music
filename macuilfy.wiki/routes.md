# Routes

## API Endpoints

### `users`
+ `GET /api/users/?term=<term_to_search>` - returns the user information or if query params present search for users like the search term. Along with the user info will came all the playlists the user has authored as well as followed playlist.
+ `GET /api/users/:userID` - retrieves user info and playlists authored and followed by the user associated with the provided userID.
+ `POST /api/users` - sign up.

### `playlist`
+ `GET /api/playlist/?term=<term_to_search>` - returns all the playlists information associated with the current user (there will always be a logged user, otherwise the site will alway return an error). If a query param present search for all playlists like the search term.
+ `GET /api/playlist/:playlistID` - returns the playlist information (name and author).
+ `POST /api/playlist/` - create a new playlist.
+ `PATCH /api/playlist/` - update playlist title.
+ `DELETE /api/playlist/:playlistID` - delete the playlist associated with the provided id.

### `song`
+ `GET /api/song/?term=<term_to_search>` - returns playlists all the songs like the search term.
+ `GET /api/song/:songID` - returns the song associated with the ID.

### `friendship`
+ `GET /api/friendship` - get current user's friends.
+ `GET /api/friendship/:userID` - get friends of the provided userID.
+ `POST /api/friendship` - current user will follow another user.
+ `DELETE /api/friendship` - current user will stop following another user.

### `playlist_followship`
+ `GET /api/playlist_followship` - retrieve current user's playlists.
+ `GET /api/playlist_followship/:userID` - retrieve playlists of the provided userID.
+ `POST /api/playlist_followship` - current user will follow a playlist.
+ `DELETE /api/playlist_followship` - current user fill stop following a playlist.

---

## Frontend Routes
+ `/login`
+ `/signup`
+ `/collection/playlists` - homepage, collection of user playlists.
+ `/users/:userId` - user profile
+ `/user/:userID/playlists/playlist/:playlistID` - show a specific playlist.
+ `/playlist/new` - create new playlist.
+ `/playlist/:playlistID/edit` - edit a playlist.
+ `/search/` - search for a specific user, song or playlist.
+ `/search/results` - display the results of a search.
