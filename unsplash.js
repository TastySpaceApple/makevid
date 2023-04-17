import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';

const unsplash = createApi({
  accessKey: 'R8BF4ETaOTtgmMYLvMV4N5Pp5I9feuOG99s9lEC2aiU',
  fetch: nodeFetch,
});


export async function unsplashSearch(query){
  const imageSearch = await unsplash.search.getPhotos({
    query,
    perPage: 20,
    orientation: 'portrait',
  });
  return imageSearch.response.results.map(r => ({url: r.urls.thumb, id: r.id}))
}