class Api::SearchesController < ApplicationController
  def index
    search_tag = params[:search_tag];
    @songs_found = Song.where("title ILIKE ?", "%#{search_tag}%")
    @users_found = User.where('username ILIKE ? and id != ?', "%#{search_tag}%", current_user.id);
  end
end
