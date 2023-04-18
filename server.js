import express from 'express';
import bodyParser from 'body-parser'
import { readProjectLabels, writeProjectLabels } from './utils.js';
import { unsplashSearch } from './unsplash.js';

const app = express();

app.use('/', express.static('webapp'))

app.use(bodyParser.json());

app.post('/load', (req, res) => {
  const project = req.body.project;
  const timings = readProjectLabels(project); 
  res.json(timings);
})


app.post('/save', (req, res) => {
  writeProjectLabels(req.body.project, req.body.data)
  res.json({});
})



app.post('/api/imagesearch', async (req,res) => {
  try{
    const images = await unsplashSearch(req.body.query)
    res.json(images)
  } catch (e) {
    console.log(e)
    res.json([])
  }

})

app.listen(process.env.PORT || 8000);