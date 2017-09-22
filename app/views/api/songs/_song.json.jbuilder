json.set! song.id do
  json.extract! song, :id, :title, :length, :explicit, :img_url, :artist_id, :album_id
end
