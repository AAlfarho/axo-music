class Api::PlaylistFollowshipsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  before_action :unauthorized_action

  def follow_playlist
    playlist_to_follow = Playlist.find(params[:id])
    unless current_user.playlist_followed.pluck(:id).include?(params[:id].to_i)
      playlistFollowship = PlaylistFollowship.new(playlist_id: playlist_to_follow.id, user_id: current_user.id)
      if playlistFollowship.save
        @user = current_user
        render :playlist_followship
      else
        render json: @user.errors.full_messages, status: 422
      end
    end
  end

  def unfollow_playlist
    playlist_to_follow = Playlist.find(params[:id])
    if current_user.playlist_followed.pluck(:id).include?(params[:id].to_i)
      playlist_followship = PlaylistFollowship.where( 'playlist_id = ? AND user_id=  ?', params[:id], current_user.id)
      playlist_followship.first.destroy
    end
    @user = current_user
    render :playlist_followship
  end

  def record_not_found
    render json: ["Unknown playlist"], status: 404
  end
end
