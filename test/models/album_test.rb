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

require 'test_helper'

class AlbumTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
