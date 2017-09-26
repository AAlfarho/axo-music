class Api::FriendshipsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  before_action :unauthorized_action

  def friend_user
    user_to_friend = User.find(params[:id])
    unless current_user.friends.pluck(:id).include?(params[:id].to_i)
      friendship = Friendship.new(user_id: current_user.id, friend_id: user_to_friend.id)
      if friendship.save
        @user = current_user
        render :friendships
      else
        render json: friendship.errors.full_messages, status: 422
      end
    end
  end

  def unfriend_user
    user_to_unfriend = User.find(params[:id])
    if current_user.friends.pluck(:id).include?(params[:id].to_i)
      friendship = Friendship.where('user_id = ? and friend_id = ?', current_user.id, params[:id])
      friendship.first.destroy
    end
    
    @user = current_user
    render :friendships
  end

  def record_not_found
    render json: ["Unknown user"], status: 404
  end
end
