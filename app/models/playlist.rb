# == Schema Information
#
# Table name: playlists
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  author_id  :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Playlist < ApplicationRecord
  valdiates :name, :author_id, presence: true

  belongs_to :author,
  primary_key: :id,
  foreign_key: :author_id,
  class_name: :User

  has_many :playlist_song_memberships,
  primary_key: :id,
  foreign_key: :playlist_id,
  class_name: :PlaylistSong

  has_many :songs,
  through: :playlist_song_memberships,
  source: :song

end
