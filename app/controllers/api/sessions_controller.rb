class Api::SessionsController < ApplicationController
  def create
    @user = User.find_by_credentials(user_params[:username], user_params[:password])
    if @user
      login!(@user)
      render "api/users/show"
    else
      render json: ["Invalid username or password."], status: 401
    end
  end

  def destroy
    @user = current_user
    if @user
      logout!
      render "api/users/show"
    else
      render json: ["No user signed in."], status: 405
    end
  end
end
