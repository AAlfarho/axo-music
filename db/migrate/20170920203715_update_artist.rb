class UpdateArtist < ActiveRecord::Migration[5.1]
  def change
    add_index :artists, :name, unique: true
  end
end
