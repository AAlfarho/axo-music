json.partial! 'api/users/user', user: @user
@user.authored_playlists.each do |playlist|
  json.partial! 'api/playlists/playlist', playlist: playlist
end
@user.playlist_followed.each do |playlist|
  json.partial! 'api/playlists/playlist', playlist: playlist
end
