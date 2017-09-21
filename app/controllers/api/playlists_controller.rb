class Api::PlaylistsController < ApplicationController
  before_action :unauthorized_action
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found


  def index
    @current_user_authored_playlists = current_user.authored_playlists.includes(:songs)
    render :index
  end

  def show
    @playlist = Playlist.includes(:songs).find(params[:id])
    render :show
  end

  def create
    @playlist = Playlist.new(playlist_params)
    @playlist.author_id = current_user.id
    if @playlist.save
      render :show
    else
      render json: @playlist.errors.full_messages, status: 422
    end
  end

  def update
    @playlist = Playlist.find(params[:id])
    if @playlist.update(playlist_params)
      @playlist.song_ids = eval(params['playlist']['song_ids'])
      render :show
    else
      render json: @playlist.errors.full_messages, status: 422
    end
  end

  def destroy
    @playlist = Playlist.find(params[:id])
    @playlist.destroy
    render :show
  end

  def playlist_params
    params.require(:playlist).permit(:name)
  end

  def record_not_found
    render json: ["Unknown playlist"], status: 404
  end

end
