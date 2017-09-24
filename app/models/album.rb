# == Schema Information
#
# Table name: albums
#
#  id                 :integer          not null, primary key
#  title              :string           not null
#  artist_id          :integer          not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  release_yr         :integer          not null
#  image_file_name    :string
#  image_content_type :string
#  image_file_size    :integer
#  image_updated_at   :datetime
#

class Album < ApplicationRecord
  validates :title, :artist_id, presence: true

  has_attached_file :image, default_url: "missing.png"
  validates_attachment_content_type :image, content_type: /\image_url\/.*\Z/

  has_many :songs,
  primary_key: :id,
  foreign_key: :album_id,
  class_name: :Song

  belongs_to :artist,
  primary_key: :id,
  foreign_key: :artist_id,
  class_name: :Artist
end
