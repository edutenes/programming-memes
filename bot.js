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

// Cargar archivos JSON
const frasesDebate = JSON.parse(fs.readFileSync(path.join(__dirname, 'frases-debate.json'), 'utf8'));
const frasesGraciosas = JSON.parse(fs.readFileSync(path.join(__dirname, 'frases-graciosas.json'), 'utf8'));
const frasesMemes = JSON.parse(fs.readFileSync(path.join(__dirname, 'frases-memes.json'), 'utf8'));


// Cargar o inicializar el contador
let contador;
try {
  contador = JSON.parse(fs.readFileSync(path.join(__dirname, 'contador.json'), 'utf8'));
} catch (error) {
  contador = { count: 0 }; // Inicializar si el archivo no existe
}

async function tweetMeme() {
  const memesDir = path.join(__dirname, 'memes', '1');
  const files = fs.readdirSync(memesDir).sort((a, b) => {
    // Extraer el número del nombre del archivo y convertirlo a entero
    const numA = parseInt(a.split('.')[0]);
    const numB = parseInt(b.split('.')[0]);
    return numA - numB;
  });

  if (contador.ultimoMeme >= files.length) {
    console.log('No hay más memes para publicar.');
    return;
  }

  const memeFileName = files[contador.ultimoMeme];
  const memePath = path.join(memesDir, memeFileName);
  const titulo = frasesMemes[memeFileName] || 'Título por defecto'; // Usar título por defecto si no se encuentra

  try {
    // Publicar el tweet con el meme
    const mediaId = await rwClient.v1.uploadMedia(memePath);
    await rwClient.v2.tweet({ text: titulo, media: { media_ids: [mediaId] } });
    console.log(`Meme publicado: ${titulo}`);

    contador.ultimoMeme++;
    // Guardar el estado actualizado del contador
    // (Asegúrate de implementar esta parte según tus necesidades)
  } catch (error) {
    console.error('Error al publicar en Twitter:', error);
  }
}


async function tweetFrasesDebate() {
  if (contador.ultimaFraseDebate < frasesDebate.length) {
    const fraseDebate = frasesDebate[contador.ultimaFraseDebate];
    
    try {
      // Publicar el tweet
      await rwClient.v2.tweet({ text: fraseDebate });
      console.log(`Frase de Debate publicada: ${fraseDebate}`);
      contador.ultimaFraseDebate++;
      // Guardar el estado actualizado del contador
      // (Asegúrate de implementar esta parte según tus necesidades)
    } catch (error) {
      console.error('Error al publicar en Twitter:', error);
    }
  } else {
    console.log('No hay más frases de debate para publicar.');
  }
}


async function tweetFrasesGraciosas() {
  if (contador.ultimaFraseGraciosa < frasesGraciosas.length) {
    const fraseGraciosa = frasesGraciosas[contador.ultimaFraseGraciosa];
    
    try {
      // Publicar el tweet
      await rwClient.v2.tweet({ text: fraseGraciosa });
      console.log(`Frase Graciosa publicada: ${fraseGraciosa}`);
      contador.ultimaFraseGraciosa++;
      // Guardar el estado actualizado del contador
      // (Asegúrate de implementar esta parte según tus necesidades)
    } catch (error) {
      console.error('Error al publicar en Twitter:', error);
    }
  } else {
    console.log('No hay más frases graciosas para publicar.');
  }
}


// Función principal para alternar entre tipos de contenido
async function tweetContent() {
  switch (contador.count % 3) {
    case 0:
      await tweetMeme();
      break;
    case 1:
      await tweetFrasesDebate();
      break;
    case 2:
      await tweetFrasesGraciosas();
      break;
  }

  // Incrementar y guardar el contador
  contador.count = (contador.count + 1) % 3; // Esto reiniciará el contador después de 3
  fs.writeFileSync(path.join(__dirname, 'contador.json'), JSON.stringify(contador, null, 2));
}

tweetContent();