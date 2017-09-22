json.playlist_detail do
  json.set! playlist.id do
    json.extract! playlist, :id, :name, :author_id
    json.author_name playlist.author.username
    json.song_ids playlist.songs.pluck(:id)
  end
end

json.songs_detail do
  playlist.songs.each do |song|
    json.partial! '/api/songs/song', song: song
  end
end
