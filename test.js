
import { readProjectLabels, writeProjectLabels } from './utils.js';
import { unsplashGetImage } from './unsplash.js';
const project = 'shortNewYorkFastTour';

const labels = readProjectLabels(project);
for(const label of labels){
  if(label.imageFull.length > 0 && label.imageFull.length < 'iLwDW2lSOzk1'.length){
    try{
      console.log(label.imageFull)
      const img = await unsplashGetImage(label.imageFull);
      console.log(img.full)
      label.imageFull = img.full;
      label.imageThumb = img.thumb;
    }
    catch(e){
      console.log(e)
      console.log('error');
      break;
    }

  }
}
writeProjectLabels(project, labels);