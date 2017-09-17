# React Component Hierarchy

## Functional Component Hierarchy
+ `Root`
  + `App`
    + `NavBar`
    + `MainPage`
    + `Footer`

## NavBar
+ `NavBar`
  + Components:
    + `SessionButtonsContainer` + `SessionButtons`
      + State: `session`

**Note:** All other components are rendered inside of `MainPage`

## Chirps
+ `ChirpIndexContainer` + `ChirpIndex`
  + Route: `/#/dashboard`
  + State: `chirps`, `users`
  + Components:
      + `ChirpIndexItem`
        + State: `chirps[:id]`, `users[:id]`, `ui`

+ `ProfileIndexContainer` + `ChirpIndex`
  + Route: `/#/users/:userId`
  + State: `chirps`, `users`
  + Components:
    + `ChirpIndexItem`
      + State: `chirps[:id]`, `users[:id]`, `ui`

+ `ChirpShowContainer` + `ChirpShow`
  + Route: `/#/chirps/:chirpId`
  + State: `chirps[:id]`, `users[:id]`, `ui`

+ `ChirpFormContainer` + `ChirpForm`
  + Route: `/#/chirps/new`
  + State:`errors.chirpForm`

## Session
+ `SessionFormContainer` + `SessionForm`
  + Route: `/#/login` and `/#/signup`
  + State: `errors.login`

## UsersSearch
+ `UserSearchIndexContainer` + `UserSearchIndex`
  + Route: `/#/`
  + State: `ui`
  + Components:
    + `UserSearchIndexItem`
    + State: none (will be made with separate ajax)
