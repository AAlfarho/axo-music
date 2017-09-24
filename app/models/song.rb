# == Schema Information
#
# Table name: songs
#
#  id         :integer          not null, primary key
#  title      :string           not null
#  length     :integer          not null
#  explicit   :boolean          default(FALSE)
#  img_url    :string
#  artist_id  :integer          not null
#  album_id   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  file_path  :string
#

class Song < ApplicationRecord
  validates :title, :length, :artist_id, :album_id, presence: true
  belongs_to :artist,
  primary_key: :id,
  foreign_key: :artist_id,
  class_name: :Artist

  belongs_to :album,
  primary_key: :id,
  foreign_key: :album_id,
  class_name: :Album

  has_many :playlist_song_memberships,
  primary_key: :id,
  foreign_key: :song_id,
  class_name: :PlaylistSong
end
