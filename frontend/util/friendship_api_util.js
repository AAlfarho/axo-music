export const friendUser = (id) => (
  $.ajax({
    method: 'POST',
    url: `api/friend_user/${id}`
  })
);

export const unfriendUser = (id) => (
  $.ajax({
    method: 'DELETE',
    url: `api/unfriend_user/${id}`
  })
);
