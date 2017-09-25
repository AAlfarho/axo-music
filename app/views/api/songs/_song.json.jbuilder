json.set! song.id do
  json.extract! song, :id, :title, :length, :explicit, :artist_id, :album_id, :file_path
  json.artist_name song.artist.name
  json.album_name song.album.title
  json.image_url asset_path(song.album.image.url)

end
