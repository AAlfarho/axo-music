class Api::PlaylistsController < ApplicationController
  before_action :unauthorized_action
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found


  def index
    @current_user_authored_playlists = current_user.authored_playlists.includes(:songs)
    @current_user_follows = current_user.playlist_followed.includes(:songs)
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
    @playlist = current_user.authored_playlists.includes(:songs).find(params[:id])
    if @playlist.update(playlist_params)
      ids = params['playlist']['song_ids'];
      if !ids || ids.length == 1 && ids.first == ""
        ids = []
      else
        ids.map!(&:to_i)
      end
      @playlist.song_ids = ids
      render :show
    else
      render json: @playlist.errors.full_messages, status: 422
    end
  end

  def destroy
    @playlist = current_user.authored_playlists.find(params[:id])
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
