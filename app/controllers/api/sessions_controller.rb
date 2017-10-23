class Api::SessionsController < ApplicationController

  GUEST_LOGIN = "sys-g".freeze

  def create
    @user = User.find_by_credentials(user_params[:username], user_params[:password])
    @user = get_next_demo_user if @user.username.starts_with?(GUEST_LOGIN)
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

  private

  def get_next_demo_user
    ## Get the last updated guest, meaning the last used demo loginq
    User.where("username ilike 'sys-g%'").order(:updated_at).first
  end

end
