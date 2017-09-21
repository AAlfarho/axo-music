## Form backend auth only return username and id
json.extract! user, :id, :username

## Leave friend_ids[] until milestone 5 (friendships) as this is not yet coded
## json.playlists_id user.friend_ids.pluck(:id)
json.playlists_ids user.authored_playlists.pluck(:id)
