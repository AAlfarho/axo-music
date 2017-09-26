Rails.application.routes.draw do

  root "static_pages#root"

  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create, :show]
    resource :session, only: [:create, :destroy]
    resources :playlists, except: [:new, :edit]
    resources :searches, only: [:index]
    post 'follow_playlist/:id', to: 'playlist_followships#follow_playlist'
    delete 'unfollow_playlist/:id', to: 'playlist_followships#unfollow_playlist'
    post 'friend_user/:id', to: 'friendships#friend_user'
    delete 'unfriend_user/:id', to: 'friendships#unfriend_user'
  end
end
