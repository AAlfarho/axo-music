class Api::UsersController < ApplicationController
  before_action :unauthorized_action, except: [:create]
  def create
    @user = User.new(user_params)
    if @user.save
      login!(@user)
      render :show
    else
      render json: @user.errors.full_messages, status: :unprocessable_entity
    end
  end

  def show
    @user = User.includes(:authored_playlists).find(params[:id])
    if @user
      render :show
    else
      render json: ["Unknown user"], status: 401
    end
  end
end
