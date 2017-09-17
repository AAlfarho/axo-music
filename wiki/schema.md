# Database Schema

## `user`
| column name       | data type | details                   |
|:------------------|:---------:|:--------------------------|
| `id`              | integer   | not null, primary key     |
| `username`        | string    | not null, indexed         |
| `email`           | string    | not null, indexed, unique |
| `img_url`         | string    | not null                  |             
| `password_digest` | string    | not null                  |
| `session_token`   | string    | not null, indexed, unique |
| `created_at`      | datetime  | not null                  |
| `updated_at`      | datetime  | not null                  |

## `song`
| column name          | data type | details                        |
|:---------------------|:---------:|:-------------------------------|
| `id`                 | integer   | not null, primary key          |
| `title`              | string    | not null                       |
| `length`             | integer   | not null,                      |
| `explicit`           | boolean   | not null,                      |
| `img_url`            | string    | not null                       |
| `release_yr`         | integer   | not null, indexed, foreign key |
| `album_id`           | integer   | not null, indexed, foreign key |
| `created_at`         | datetime  | not null                       |
| `updated_at`         | datetime  | not null                       |

+ `album_id` references `album`  

## `album`
| column name          | data type | details                        |
|:---------------------|:---------:|:-------------------------------|
| `id`                 | integer   | not null, primary key          |
| `name`               | string    | not null                       |
| `img_url`            | string    | not null                       |
| `artist_id`          | integer   | not null, indexed, foreign key |
| `created_at`         | datetime  | not null                       |
| `updated_at`         | datetime  | not null                       |

+ `artist_id` references `artist`  

## `artist`
| column name          | data type | details                        |
|:---------------------|:---------:|:-------------------------------|
| `id`                 | integer   | not null, primary key          |
| `name`               | string    | not null                       |
| `img_url`            | string    | not null                       |
| `created_at`         | datetime  | not null                       |
| `updated_at`         | datetime  | not null                       |

## `playlist`
| column name          | data type | details                        |
|:---------------------|:---------:|:-------------------------------|
| `id`                 | integer   | not null, primary key          |
| `name`               | string    | not null                       |
| `author_id`          | integer   | not null, indexed, foreign key |
| `created_at`         | datetime  | not null                       |
| `updated_at`         | datetime  | not null                       |

+ `author_id` references `user`  

## `playlist_songs`
| column name       | data type | details                        |
|:------------------|:---------:|:-------------------------------|
| `id`              | integer   | not null, primary key          |
| `playlist_id`     | integer   | not null, indexed, foreign key |
| `song_id`         | integer   | not null, indexed, foreign key  |             
| `created_at`      | datetime  | not null                       |
| `updated_at`      | datetime  | not null                       |

+ `playlist_id` references `playlist`  
+ `song_id` references `song`
+ index on `[:user_id, :friend_id], unique: true`

## `friendship`
| column name       | data type | details                        |
|:------------------|:---------:|:-------------------------------|
| `id`              | integer   | not null, primary key          |
| `user_id`         | integer   | not null, indexed, foreign key |
| `friend_id`       | integer   | not null, indexed, foreign key  |             
| `created_at`      | datetime  | not null                       |
| `updated_at`      | datetime  | not null                       |

+ `user_id` references `user`  
+ `friend_id` references `user`
+ index on `[:user_id, :friend_id], unique: true`

## `playlist_followship`
| column name       | data type | details                        |
|:------------------|:---------:|:-------------------------------|
| `id`              | integer   | not null, primary key          |
| `playlist_id`         | integer   | not null, indexed, foreign key |
| `user_id`       | integer   | not null, indexed, foreign key  |             
| `created_at`      | datetime  | not null                       |
| `updated_at`      | datetime  | not null                       |

+ `playlist_id` references `playlist`
+ `user_id` references `user`  
+ index on `[:user_id, :playlist_id], unique: true`
