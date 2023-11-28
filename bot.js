const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
	apiKey: "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",
});



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

// Función para obtener la imagen con el número más bajo en la carpeta memes/1
function getLowestNumberedMemePath() {
  const memesDir = path.join(__dirname, 'memes', '1');
  const files = fs.readdirSync(memesDir);
  if (files.length === 0) {
    console.log('No hay más memes para publicar.');
    return null;
  }
  const sortedFiles = files.sort((a, b) => parseInt(a) - parseInt(b));
  return path.join(memesDir, sortedFiles[0]);
}

// Función para mover la imagen a la carpeta memes/2 después de publicar
function moveMemeToPublished(memePath) {
  const publishedDir = path.join(__dirname, 'memes', '2');
  const publishedPath = path.join(publishedDir, path.basename(memePath));
  fs.renameSync(memePath, publishedPath);
  console.log(`Meme movido a: ${publishedPath}`);
}

// Función modificada para publicar el meme en Twitter
async function tweetMeme() {
  const memePath = getLowestNumberedMemePath();
  if (memePath) {
    try {
      const mediaId = await rwClient.v1.uploadMedia(memePath);
      await rwClient.v2.tweet({ text: 'JavaScript, My Favorite Language...', media: { media_ids: [mediaId] } });
      console.log('Meme publicado en Twitter');
      moveMemeToPublished(memePath);
    } catch (error) {
      console.error('Error al publicar en Twitter:', error);
    }
  }
}

// Ejecutamos la función tweetMeme
tweetMeme();