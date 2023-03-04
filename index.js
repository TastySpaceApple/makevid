import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { Canvas, loadImage, registerFont } from 'canvas';
import { stitchFramesToVideo } from './utils/stitchFramesToVideo.js';
import { drawImageProp } from './utils/drawImageProp.js';
import { drawCaption } from './utils/drawCaption.js';

// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

const tmpFolder = 'C:\\tmp'

// Clean up the temporary directories first
for (const path of ['out', tmpFolder+'/output']) {
    if (fs.existsSync(path)) {
        await fs.promises.rm(path, { recursive: true });
    }
    await fs.promises.mkdir(path, { recursive: true });
}

const project = "01_grindr";

const canvas = new Canvas(720, 1280);
const context = canvas.getContext('2d');

const labels = readFileLabels(`${project}/labels.txt`);
console.log(labels.length)


// The video length and frame rate, as well as the number of frames required
// to create the video
const duration = 87.6;
const frameRate = 24;
const frameCount = Math.floor(duration * frameRate);

// Render each frame
for (let i = 0; i < frameCount; i++) {

    const time = i / frameRate;

    console.log(`Rendering frame ${i} at ${Math.round(time * 10) / 10} seconds...`);

    // Clear the canvas with a white background color. This is required as we are
    // reusing the canvas with every frame

    const isRendered = await renderFrame(context, time);

    if(isRendered){
      const output = canvas.toBuffer('image/png');
      await fs.promises.writeFile(getFrameFilePath(i), output);
    } else {
      await fs.promises.copyFile(getFrameFilePath(i-1), getFrameFilePath(i))
    }
}

function getFrameFilePath (frameIndex) {
  return `${tmpFolder}/output/frame-${String(frameIndex).padStart(4, '0')}.png`
}

console.log("finished frames")

// Stitch all frames together with FFmpeg
await stitchFramesToVideo(
  tmpFolder+'/output/frame-%04d.png',
  `${project}/audio.wav`,
  'out/video.mp4',
  duration,
  frameRate,
);

var lastLabelIndex = -1;

async function renderFrame(ctx, time) {
    let labelIndex = 0;
    for(let i=1; i<labels.length-1; i++){
      if(labels[i].start < time && time < labels[i+1].start){
        labelIndex = i;
      }
    }

    if(time > labels[labels.length-1].start){
      labelIndex = labels.length-1;
    }

    if(lastLabelIndex != labelIndex){
      let frameImage = await loadImage(`${project}/images/${String(labelIndex+1).padStart(2, '0')}.jpg`)
      drawImageProp(ctx, frameImage);
      drawCaption(ctx, labels[labelIndex].text)
      lastLabelIndex = labelIndex;
      return true;
    }

    return false;
}

function readFileLabels(file){
  const content = fs.readFileSync(file, "utf8");
  return content.split('\n').map(line => {
    console.log(line)
    const [start, end, text] = line.split('\t')
    return {start, end, text}
  }).filter(line => !!line.text)
}