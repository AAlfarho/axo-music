# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  username        :string           not null
#  email           :string           not null
#  img_url         :string
#  password_digest :string           not null
#  session_token   :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class User < ApplicationRecord
  validates :username, :email, :password_digest, :session_token, presence:true, uniqueness: true
  validates :password, length: { minimum: 6 }, allow_nil: true

  after_initialize :ensure_session_token, :lowercase_username

  has_many :authored_playlists,
  primary_key: :id,
  foreign_key: :author_id,
  class_name: :Playlist

  has_many :playlist_followship,
  primary_key: :id,
  foreign_key: :user_id,
  class_name: :PlaylistFollowship

  has_many :playlist_followed,
  through: :playlist_followship,
  source: :playlist

  has_many :friendhsips,
  primary_key: :id,
  foreign_key: :user_id,
  class_name: :Friendship

  has_many :other_friendships,
  primary_key: :id,
  foreign_key: :friend_id,
  class_name: :User

  has_many :friends,
  through: :friendhsips,
  source: :user_friends

  attr_reader :password

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password);
  end

  def self.find_by_credentials(identifier, password)
    # user can use its usename or email to log in.
    user = User.get_user(username: identifier.downcase) || User.get_user(email: identifier.downcase)
    user && user.is_password?(password) ? user : nil
  end

  def self.get_user(identifier)
    begin
      user = User.find_by(identifier)
    rescue ActiveRecord::RecordNotFound
      return nil
    end
    user
  end

  def reset_session_token!
    self.session_token = SecureRandom.urlsafe_base64(64)
    self.save
    self.session_token
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  private

  def ensure_session_token
    self.session_token ||= self.reset_session_token!
  end

  def lowercase_username
    self.username.downcase!
  end

end
