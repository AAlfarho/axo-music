class RemoveReleaseFromSong < ActiveRecord::Migration[5.1]
  def change
    remove_column :songs, :release_yr, :integer
    add_column :albums, :release_yr, :integer, null: false
  end
end
