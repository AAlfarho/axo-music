class Api::FriendshipsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  before_action :unauthorized_action

  def friend_user
    @user = User.find(params[:id])
    unless current_user.friends.pluck(:id).include?(params[:id].to_i)
      friendship = Friendship.new(user_id: current_user.id, friend_id: @user.id)
      if friendship.save
        render :friendships
      else
        render json: friendship.errors.full_messages, status: 422
      end
    end
  end

  def unfriend_user
    @user = User.find(params[:id])
    if current_user.friends.pluck(:id).include?(params[:id].to_i)
      friendship = Friendship.where('user_id = ? and friend_id = ?', current_user.id, @user.id)
      friendship.first.destroy
    end
    render :friendships
  end

  def record_not_found
    render json: ["Unknown user"], status: 404
  end
end
