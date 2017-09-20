class ApplicationController < ActionController::Base
  # protect_from_forgery with: :exception
  helper_method :current_user, :logged_in?

  def login!(user)
    session[:session_token] = user.reset_session_token!
    @current_user = user;
  end

  def logout!
    if logged_in?
      current_user.reset_session_token!
      session[:session_token] = nil
    end
  end

  def current_user
    return nil unless session[:session_token]
    @current_user ||= User.find_by(session_token: session[:session_token])
  end

  def logged_in?
    !!current_user
  end

  def user_params
    params.require(:user).permit(:username, :password, :email)
  end

  def require_logged_in
    unless current_user
      render json: ['Unauthorized action.'], status: 401
    end
  end

  def unauthorized_action
    render json: ["Unauthorized action"], status: 401 unless logged_in?
  end

end
