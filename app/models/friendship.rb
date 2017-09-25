# == Schema Information
#
# Table name: friendships
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  friend_id  :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Friendship < ApplicationRecord

  belongs_to :og_user,
  primary_key: :id,
  foreign_key: :user_id,
  class_name: :User

  belongs_to :user_friends,
  primary_key: :id,
  foreign_key: :friend_id,
  class_name: :User
end
