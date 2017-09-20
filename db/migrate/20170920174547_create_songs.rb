class CreateSongs < ActiveRecord::Migration[5.1]
  def change
    create_table :songs do |t|
      t.string :title, null: false
      t.integer :length, null: false
      t.boolean :explicit, default: false
      t.string :img_url
      t.integer :release_yr, null: false
      t.integer :artist_id, null: false
      t.integer :album_id, null: false

      t.timestamps
    end
    add_index :songs, :artist_id
    add_index :songs, :album_id
  end
end
