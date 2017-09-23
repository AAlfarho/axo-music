class AddFilePathFromSong < ActiveRecord::Migration[5.1]
  def change
    add_column :songs, :file_path, :string
  end
end
