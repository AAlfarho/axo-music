@current_user_authored_playlists.each do |playlist|
  json.partial! 'api/playlists/playlist', playlist: playlist
end
