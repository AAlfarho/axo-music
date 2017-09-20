# == Schema Information
#
# Table name: artists
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  img_url    :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Artist < ApplicationRecord
  validates :name, uniqueness: true
  has_many :albums,
  primary_key: :id,
  foreign_key: :artist_id,
  class_name: :Album

  has_many :songs,
  primary_key: :id,
  foreign_key: :artist_id,
  class_name: :Song
end
