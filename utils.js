import fs from 'fs';
import path from 'path';

export function readProjectLabels(projectName){
  const file = path.join('projects', projectName, 'labels.txt')
  const content = fs.readFileSync(file, "utf8");
  return content.split('\r\n').map(line => {
    const [start, end, text, imageFull, imageThumb] = line.split('\t')
    return {start, end, text, imageFull, imageThumb}
  }).filter(line => !!line.text)
}

export function writeProjectLabels(projectName, data){
  const file = path.join('projects', projectName, 'labels.txt')
  const content = data.map(line => {
    const {start, end, text, imageFull, imageThumb} = line;
    return [start, end, text, imageFull, imageThumb].join('\t')
  }).join('\r\n')
  fs.writeFileSync(file, content);
}