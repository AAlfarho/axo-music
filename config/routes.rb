Rails.application.routes.draw do

  root "static_pages#root"

  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create, :show]
    resource :session, only: [:create, :destroy]
    resources :playlists, except: [:new, :edit]
    resources :searches, only: [:index]
    post 'playlist_followship/follow/:id', to: 'playlist_followships#follow_playlist'
    delete 'playlist_followship/unfollow/:id', to: 'playlist_followships#unfollow_playlist'
    post 'friendships/friend/:id', to: 'friendhsips#follow_playlist'
    delete 'friendships/unfriend/:id', to: 'friendhsips#unfollow_playlist'

  end
end
