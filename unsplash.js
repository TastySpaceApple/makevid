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
  return imageSearch.response.results.map(r => ({url: r.urls.thumb, full: r.urls.full}))
}

export async function unsplashGetImage(imageId){
  const r = await unsplash.photos.get(
    { photoId: imageId },
  )  
  return {url: r.urls.thumb, full: r.urls.full}
}