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
aalfarho = User.create(username: 'Aalfarho', email: 'st.alfaro@gmail.com', password: 'password')
guest = User.create(username: 'Guest', email: 'guest@example.com', password: 'password')


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
is_the_is_are = Album.new(title: 'Is The Is Are', artist_id: diiv.id, release_yr: 2016)
is_the_is_are.image = File.open(File.join(Rails.root,'app/assets/images/is_the.jpeg'))
is_the_is_are.save

oshin = Album.new(title: 'Oshin', artist_id: diiv.id, release_yr: 2012)
oshin.image = File.open(File.join(Rails.root,'app/assets/images/oshin.png'))


sommersault = Album.new(title: 'Sommersault', artist_id: beach_fossils.id, release_yr: 2017)
sommersault.image = File.open(File.join(Rails.root,'app/assets/images/somersault.jpeg'))
sommersault.save

clash_the_truth = Album.new(title: 'Clash The Truth', artist_id: beach_fossils.id, release_yr: 2013)
clash_the_truth.image = File.open(File.join(Rails.root,'app/assets/images/clash.jpg'))
clash_the_truth.save


############################################################
################ Songs seed creation #######################
############################################################
Song.destroy_all
##Sommersault songs
this_year = Song.create(title: 'This Year', length: 168, artist_id: beach_fossils.id, album_id: sommersault.id)
sugar = Song.create(title: 'Sugar', length: 194, artist_id: beach_fossils.id, album_id: sommersault.id)
saint_ivy = Song.create(title: 'Saint Ivy', length: 224, artist_id: beach_fossils.id, album_id: sommersault.id)

##Clash the truth songs
clash_the = Song.create(title: 'Clash The Truth', length: 123, artist_id: beach_fossils.id, album_id: clash_the_truth.id)
sleep_apnea = Song.create(title: 'Sleep Apnea', length: 146, artist_id: beach_fossils.id, album_id: clash_the_truth.id)

##Is The Is Are songs
yr_not_far = Song.create(title: 'Yr Not Far', length: 123, artist_id: diiv.id, album_id: is_the_is_are.id)
valentine = Song.create(title: 'Valentine', length: 197, artist_id: diiv.id, album_id: is_the_is_are.id)

##Oshin
doused = Song.create(title: 'Doused', length: 222, artist_id: diiv.id, album_id: oshin.id)
druun = Song.create(title: '(Druun)', length: 127, artist_id: diiv.id, album_id: oshin.id)


############################################################
################ Playlist seed creation ####################
############################################################
Playlist.destroy_all
#aalfarho playlsits
this_is_diiv = Playlist.create(name: 'This Is DIIV', author_id: aalfarho.id)
this_is_beach_fossils = Playlist.create(name: 'This Is Beach Fossils', author_id: aalfarho.id)

#guest playlist
all_indie = Playlist.create(name: 'All Indie', author_id: guest.id)

############################################################
################ Playlist-song seed creation ###############
############################################################
PlaylistSong.destroy_all
diiv.songs.each do |song|
  PlaylistSong.create(playlist_id: this_is_diiv.id, song_id: song.id)
  PlaylistSong.create(playlist_id: all_indie.id, song_id: song.id)
end

beach_fossils.songs.each do |song|
  PlaylistSong.create(playlist_id: this_is_beach_fossils.id, song_id: song.id)
  PlaylistSong.create(playlist_id: all_indie.id, song_id: song.id)
end
