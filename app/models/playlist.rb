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
  validates :name, :author_id, presence: true

  belongs_to :author,
  primary_key: :id,
  foreign_key: :author_id,
  class_name: :User

  has_many :playlist_song_memberships, ->{order('playlist_songs.created_at asc')},
  primary_key: :id,
  foreign_key: :playlist_id,
  class_name: :PlaylistSong,
  dependent: :destroy

  has_many :playlist_followships,
  primary_key: :id,
  foreign_key: :playlist_id,
  class_name: :PlaylistFollowship

  has_many :songs,
  through: :playlist_song_memberships,
  source: :song

  has_many :followers,
  through: :playlist_followships,
  source: :user

end
