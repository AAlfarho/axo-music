image = asset_path('missing.png')
unless playlist.songs.empty?
  image = asset_path(playlist.songs.first.album.image.url)
end

json.playlist_detail do
  json.set! playlist.id do
    json.extract! playlist, :id, :name, :author_id
    json.author_name playlist.author.username
    json.song_ids playlist.songs.pluck(:id)
    json.user_owns playlist.author_id == current_user.id
    json.image_url image
  end
end

json.songs_detail do
  playlist.songs.each do |song|
    json.partial! '/api/songs/song', song: song
  end
end
