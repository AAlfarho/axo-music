require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'password encryption' do

    it 'does not save passwords to the database' do
      User.create!({
          username: 'test',
          password: 'nunyabusiness',
          email: 'email@email.com'
      })
      user = User.find_by_username('test')
      expect(user.password).not_to be('nunyabusiness')
    end

    # Add more tests here!

  end
end