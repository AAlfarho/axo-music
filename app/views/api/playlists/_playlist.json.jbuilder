json.set! playlist.id do
  json.extract! playlist, :id, :name, :author_id
  json.song_ids playlist.songs.pluck(:id)
end
