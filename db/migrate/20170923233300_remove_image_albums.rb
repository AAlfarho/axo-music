class RemoveImageAlbums < ActiveRecord::Migration[5.1]
  def change
    remove_column :albums, :img_url, :string
    add_attachment :albums, :image
  end
end
