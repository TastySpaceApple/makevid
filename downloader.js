import path from 'path';
import fs from 'fs';
import axios from 'axios';
import https from 'https';

export async function downloadImage (url) { 
  const fileLocation = 'tmp/' + url.endsWith('.png') ? 'tmp.png' : 'tmp.jpg'
  const writer = fs.createWriteStream(fileLocation)

  for(let tries=0; tries<5; tries++){
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        // headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36' },
        timeout: 20*1000,
        httpAgent: new https.Agent({ keepAlive: true }),
      })
      response.data.pipe(writer)
      break;
    } catch {
      console.log('retrying axios request... ' + tries);
    }  
  }


  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(fileLocation))
    writer.on('error', reject);
  })
}