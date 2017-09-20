# == Schema Information
#
# Table name: albums
#
#  id         :integer          not null, primary key
#  title      :string           not null
#  img_url    :string
#  artist_id  :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  release_yr :integer          not null
#

class Album < ApplicationRecord
  validates :title, :artist_id, presence: true

  has_many :songs,
  primary_key: :id,
  foreign_key: :album_id,
  class_name: :Song

  belongs_to :artist,
  primary_key: :id,
  foreign_key: :artist_id,
  class_name: :Artist
end
