const { TwitterApi } = require('twitter-api-v2');

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuración del cliente de Twitter
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET_KEY,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
const rwClient = twitterClient.readWrite;

// Función para descargar un meme
async function downloadMeme() {
  try {
    const response = await axios.get('https://tg.i-c-a.su/json/programmerjokes/1?limit=1');
    const message = response.data.messages[0];
    const memeId = message.id;
    const memeUrl = `https://tg.i-c-a.su/media/programmerjokes/${memeId}`;
    const memeResponse = await axios.get(memeUrl, { responseType: 'arraybuffer' });
    const memePath = path.join(__dirname, 'memes', `${memeId}.png`);
    fs.writeFileSync(memePath, memeResponse.data);
    console.log(`Meme descargado: ${memeId}`);
    return memePath;
  } catch (error) {
    console.error('Error al descargar el meme:', error);
    return null;
  }
}

// Función para publicar el meme en Twitter
async function tweetMeme() {
  const memePath = await downloadMeme();
  if (memePath) {
    try {
      const mediaId = await rwClient.v1.uploadMedia(memePath);
      await rwClient.v2.tweet({ text: '¡Mira este meme de programación!', media: { media_ids: [mediaId] } });
      console.log('Meme publicado en Twitter');
    } catch (error) {
      console.error('Error al publicar en Twitter:', error);
    }
  }
}

tweetMeme();
