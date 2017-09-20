# == Schema Information
#
# Table name: playlist_followships
#
#  id          :integer          not null, primary key
#  playlist_id :integer          not null
#  user_id     :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

require 'test_helper'

class PlaylistFollowshipTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
