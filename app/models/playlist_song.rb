# == Schema Information
#
# Table name: playlist_songs
#
#  id          :integer          not null, primary key
#  playlist_id :integer          not null
#  song_id     :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class PlaylistSong < ApplicationRecord
  validates :playlist_id, :song_id, presence: true

  belongs_to :playlist,
  primary_key: :id,
  foreign_key: :playlist_id,
  class_name: :Playlist

  belongs_to :song,
  primary_key: :id,
  foreign_key: :song_id,
  class_name: :Song
end
