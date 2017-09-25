require 'test_helper'

class Api::PlaylistFollowshipsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_playlist_followships_create_url
    assert_response :success
  end

  test "should get destroy" do
    get api_playlist_followships_destroy_url
    assert_response :success
  end

end
