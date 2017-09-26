## Form backend auth only return username and id
json.user_details do
  json.extract! user, :id, :username

  ## Leave friend_ids[] until milestone 5 (friendships) as this is not yet coded
  json.follow_playlists_ids user.playlist_followed.pluck(:id)
  json.playlists_ids user.authored_playlists.pluck(:id)
  json.friend_ids user.friends.pluck(:id)
  json.image_url user.img_url || "https://s3-us-west-1.amazonaws.com/aalfarho-axo/images/missing.png"
  if current_user && current_user.friends
    json.user_friend current_user.friends.pluck(:id).include?(user.id)
  end
end

json.friends_details do
  user.friends.each do |friend|
    json.set! friend.id do
      json.extract! friend, :id, :username

      ## Leave friend_ids[] until milestone 5 (friendships) as this is not yet coded
      json.follow_playlists_ids friend.playlist_followed.pluck(:id)
      json.playlists_ids friend.authored_playlists.pluck(:id)
      json.friend_ids friend.friends.pluck(:id)
      json.image_url user.img_url || "https://s3-us-west-1.amazonaws.com/aalfarho-axo/images/missing.png"
      if current_user && current_user.friends
        json.user_friend current_user.friends.pluck(:id).include?(friend.id)
      end
    end
  end
end
