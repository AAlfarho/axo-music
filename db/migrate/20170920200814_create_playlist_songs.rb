class CreatePlaylistSongs < ActiveRecord::Migration[5.1]
  def change
    create_table :playlist_songs do |t|
      t.integer :playlist_id, null: false
      t.integer :song_id, null: false

      t.timestamps
    end
    add_index :playlist_songs, :playlist_id
    add_index :playlist_songs, :song_id
  end
end
