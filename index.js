const fs = require('fs');
const path = require('path');

let memesDictionary = {};

for (let i = 331; i <= 1949; i++) {
  memesDictionary[`${i}.png`] = ``;
}

fs.writeFileSync(path.join(__dirname, 'frases-memes.json'), JSON.stringify(memesDictionary, null, 2));
