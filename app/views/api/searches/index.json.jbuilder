json.song_results do
  @songs_found.each do |song|
    json.partial! '/api/songs/song', song: song
  end
end

json.user_results do
  @users_found.each do |user|
    json.partial! '/api/users/user', user: user
  end
end
