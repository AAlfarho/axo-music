@current_user_authored_playlists.each do |playlist|
  json.partial! 'api/playlists/playlist', playlist: playlist
end

@current_user_follows.each do |playlist|
  json.partial! 'api/playlists/playlist', playlist: playlist
end
