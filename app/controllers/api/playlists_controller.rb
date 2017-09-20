class Api::PlaylistsController < ApplicationController
  before_action :unauthorized_action

  def index
    @current_user_authored_playlists = current_user.authored_playlists.includes(:songs)
    render :index
  end

  def show
    @playlist = Playlist.includes(:songs).find(params[:id])
    if @playlist
      render :show
    else
      render json: ["Unknown playlist"], status: 404
    end
  end
end
