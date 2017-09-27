export const searchFor = (search_tag) => (
  $.ajax({
    method: 'GET',
    url : 'api/searches/',
    data: {search_tag}
  })
);
