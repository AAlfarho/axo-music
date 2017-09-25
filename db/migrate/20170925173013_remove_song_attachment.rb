class RemoveSongAttachment < ActiveRecord::Migration[5.1]
  def change
    remove_attachment :albums, :image
    add_column :albums, :image_url, :string
  end
end
