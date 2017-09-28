class Api::SearchesController < ApplicationController
  def index
    search_tag = params[:search_tag];
    @songs_found = Song.where("title ILIKE ?", "%#{search_tag}%");
    Artist.where('name ILIKE ?', "%#{search_tag}%").each do |artist|
      @songs_found += artist.songs
    end
    Album.where('title ILIKE ?', "%#{search_tag}%").each do |album|
      @songs_found += album.songs
    end
    @users_found = User.where('username ILIKE ? and id != ?', "%#{search_tag}%", current_user.id);
  end
end
