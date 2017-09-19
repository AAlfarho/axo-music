class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :username, null: false, unique: true
      t.string :email, null: false, unique: true
      t.string :img_url
      t.string :password_digest, null: false, unique: true
      t.string :session_token, null: false, unique: true
      t.timestamps
    end
  end
end
