## Form backend auth only return username and id
json.extract! user, :id, :username

## Leave friend_ids[] until milestone 5 (friendships) as this is not yet coded
json.follow_playlists_ids user.playlist_followed.pluck(:id)
json.playlists_ids user.authored_playlists.pluck(:id)
json.friend_ids user.friends.pluck(:id)
