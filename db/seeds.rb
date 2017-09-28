# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

############################################################
############### User seed creation #########################
############################################################
User.destroy_all
PlaylistFollowship.destroy_all
PlaylistSong.destroy_all
aalfarho = User.create(username: 'Aalfarho', email: 'st.alfaro@gmail.com', password: 'password', img_url: "https://s3-us-west-1.amazonaws.com/aalfarho-axo/images/aalfarho_avatar.jpg")
guest = User.create(username: 'Guest', email: 'guest@example.com', password: 'password', img_url: Faker::Avatar.image('guest'))
teslium = User.create(username: 'teslium', email:'teslium@example.com', password: 'password', img_url: "https://s3-us-west-1.amazonaws.com/aalfarho-axo/images/tesla.jpg");

random_users = [guest]
25.times do
  name = Faker::Name.first_name
  password = "password"
  img_url = Faker::Avatar.image(name)
  email = Faker::Internet.email
  user = User.create(username: name, password: password, img_url: img_url, email: email);
  random_users << user
end


############################################################
################ Friendhsip seed creation ##################
############################################################
Friendship.destroy_all

##Friendly joe and guest are friends with everyone
Friendship.create(user_id: teslium.id, friend_id: aalfarho.id)
Friendship.create(user_id: teslium.id, friend_id: guest.id)

Friendship.create(user_id: guest.id, friend_id: aalfarho.id)
Friendship.create(user_id: guest.id, friend_id: teslium.id)


##aalfarho is friends only with guest
Friendship.create(user_id: aalfarho.id, friend_id: guest.id)

prng = Random.new

random_users.each do |r_user|
    Friendship.create(user_id: r_user.id, friend_id: random_users[prng.rand(random_users.length)].id)
end

############################################################
############### Artist seed creation #######################
############################################################
Artist.destroy_all
beach_fossils = Artist.create(name: 'Beach Fossils')
diiv = Artist.create(name: 'DIIV')

############################################################
################ Album seed creation #######################
############################################################
Album.destroy_all
is_the_is_are = Album.create(title: 'Is The Is Are', artist_id: diiv.id, release_yr: 2016, image_url: "https://s3-us-west-1.amazonaws.com/aalfarho-axo/images/is_the.jpeg")

oshin = Album.create(title: 'Oshin', artist_id: diiv.id, release_yr: 2012, image_url: 'https://s3-us-west-1.amazonaws.com/aalfarho-axo/images/oshin.png')


sommersault = Album.create(title: 'Sommersault', artist_id: beach_fossils.id, release_yr: 2017, image_url: "https://s3-us-west-1.amazonaws.com/aalfarho-axo/images/somersault.jpeg")

clash_the_truth = Album.create(title: 'Clash The Truth', artist_id: beach_fossils.id, release_yr: 2013, image_url: "https://s3-us-west-1.amazonaws.com/aalfarho-axo/images/clash.jpg")


############################################################
################ Songs seed creation #######################
############################################################
song_array = [
  'https://s3.amazonaws.com/aalfarho-axo-dev/band/diiv/is_there_is_are/01_Track_1.mp3',
  'https://s3.amazonaws.com/aalfarho-axo-dev/band/diiv/is_there_is_are/02_Track_2.mp3',
  'https://s3.amazonaws.com/aalfarho-axo-dev/band/diiv/is_there_is_are/03_Track_3.mp3',
  'https://s3.amazonaws.com/aalfarho-axo-dev/band/diiv/is_there_is_are/04_Track_4.mp3',
  'https://s3.amazonaws.com/aalfarho-axo-dev/band/diiv/is_there_is_are/05_Track_5.mp3',
  'https://s3.amazonaws.com/aalfarho-axo-dev/band/diiv/is_there_is_are/06_Track_6.mp3',
  'https://s3.amazonaws.com/aalfarho-axo-dev/band/diiv/is_there_is_are/07_Track_7.mp3',
  'https://s3.amazonaws.com/aalfarho-axo-dev/band/diiv/is_there_is_are/08_Track_8.mp3',
  'https://s3.amazonaws.com/aalfarho-axo-dev/band/diiv/is_there_is_are/09_Track_9.mp3',
  'https://s3.amazonaws.com/aalfarho-axo-dev/band/diiv/is_there_is_are/10_Track_10.mp3'
]


all_songs = []
Song.destroy_all
##Sommersault songs
this_year = Song.create(title: 'This Year', length: 168, artist_id: beach_fossils.id, album_id: sommersault.id, file_path: song_array[0])
sugar = Song.create(title: 'Sugar', length: 194, artist_id: beach_fossils.id, album_id: sommersault.id, file_path: song_array[1])
saint_ivy = Song.create(title: 'Saint Ivy', length: 224, artist_id: beach_fossils.id, album_id: sommersault.id, file_path: song_array[2])

##Clash the truth songs
clash_the = Song.create(title: 'Clash The Truth', length: 123, artist_id: beach_fossils.id, album_id: clash_the_truth.id, file_path: song_array[3])
sleep_apnea = Song.create(title: 'Sleep Apnea', length: 146, artist_id: beach_fossils.id, album_id: clash_the_truth.id, file_path: song_array[4])

##Is The Is Are songs
yr_not_far = Song.create(title: 'Yr Not Far', length: 123, artist_id: diiv.id, album_id: is_the_is_are.id, file_path: song_array[5])
valentine = Song.create(title: 'Valentine', length: 197, artist_id: diiv.id, album_id: is_the_is_are.id, file_path: song_array[6])

##Oshin
doused = Song.create(title: 'Doused', length: 222, artist_id: diiv.id, album_id: oshin.id, file_path: song_array[7])
druun = Song.create(title: '(Druun)', length: 127, artist_id: diiv.id, album_id: oshin.id, file_path: song_array[8])

all_songs += [this_year] + [sugar] + [saint_ivy] + [clash_the] + [sleep_apnea]+ [yr_not_far] + [valentine] + [doused] + [druun]

############################################################
################ Playlist seed creation ####################
############################################################
Playlist.destroy_all
#aalfarho playlsits
this_is_diiv = Playlist.create(name: 'This Is DIIV', author_id: aalfarho.id)
this_is_beach_fossils = Playlist.create(name: 'This Is Beach Fossils', author_id: aalfarho.id)
Playlist.create(name: 'In construction...', author_id: aalfarho.id)

#guest playlist
all_indie = Playlist.create(name: 'All Indie', author_id: guest.id)
Playlist.create(name: 'Empty', author_id: guest.id)

#teslium playlist
alterntive_current = Playlist.create(name: 'Alternative Current', author_id: teslium.id)

## Random generated playlists
random_playlists = []

random_users.each do |r_user|
    n_playlists = prng.rand(5)
    n_playlists.times do
      n_followers = prng.rand(6)
      n_songs = prng.rand(4)
      random_pl = Playlist.create(name: Faker::Hipster.words(2).join(" ").capitalize, author_id: r_user.id)

      n_followers.times do
        follower_user = random_users[prng.rand(random_users.length)]
        next if r_user.id == follower_user.id
        PlaylistFollowship.create(playlist_id: random_pl.id, user_id: follower_user.id)
      end

      ##add songs to playlists
      all_songs.sample(n_songs).each do |song|
        PlaylistSong.create(playlist_id: random_pl.id, song_id: song.id)
      end

      random_playlists << random_pl
    end

end


############################################################
################ Playlist-follow seed creation #############
############################################################
##Guest follows 2 of aalfarho's playlists and teslium

PlaylistFollowship.create(playlist_id: this_is_diiv.id, user_id: guest.id)
PlaylistFollowship.create(playlist_id: this_is_beach_fossils.id, user_id: guest.id)
PlaylistFollowship.create(playlist_id: alterntive_current.id, user_id: guest.id)

##aalfarho follows only the non-empty playlist form guest
PlaylistFollowship.create(playlist_id: all_indie.id, user_id: aalfarho.id)


############################################################
################ Playlist-song seed creation ###############
############################################################
diiv.songs.each_with_index do |song, idx|
  if idx.odd?
    PlaylistSong.create(playlist_id: this_is_diiv.id, song_id: song.id)
  else
    PlaylistSong.create(playlist_id: all_indie.id, song_id: song.id)
  end
end

beach_fossils.songs.each_with_index do |song, idx|
  if idx.odd?
    PlaylistSong.create(playlist_id: this_is_beach_fossils.id, song_id: song.id)
  else
    PlaylistSong.create(playlist_id: all_indie.id, song_id: song.id)
  end
end
