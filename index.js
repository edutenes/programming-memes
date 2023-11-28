const fs = require('fs');
const path = require('path');

// Ruta del archivo JSON para el contador
const contadorFilePath = path.join(__dirname, 'contador.json');

// Función para obtener el valor actual del contador desde el archivo JSON
function getContador() {
  try {
    const contadorData = fs.readFileSync(contadorFilePath, 'utf8');
    const contador = JSON.parse(contadorData);
    return contador.count;
  } catch (error) {
    // Si el archivo no existe o hay un error al leerlo, iniciar el contador en 0
    return 0;
  }
}

// Función para incrementar el contador y guardarlo en el archivo JSON
function incrementarContador() {
  const contador = getContador() + 1;
  const contadorData = { count: contador };

  fs.writeFileSync(contadorFilePath, JSON.stringify(contadorData, null, 2), 'utf8');
}

// Variables para mantener un registro de frases y rutas de imágenes utilizadas
let currentIndex = getContador();

// Cargar las listas de frases desde los archivos JSON
const frasesMemes = require('./frases-memes.json');
const frasesGraciosas = require('./frases-graciosas.json');
const frasesDebate = require('./frases-debate.json');

// Función para obtener la siguiente frase y su imagen asociada en el orden específico
function getNextMemeAndPhrase() {
  if (currentIndex % 3 === 0) {
    return { frase: frasesMemes['331.png'], imagePath: 'memes/1/331.png' };
  } else if (currentIndex % 3 === 1) {
    return { frase: frasesGraciosas[0], imagePath: getImagePath('332.png') };
  } else {
    return { frase: frasesDebate[0], imagePath: getImagePath('334.png') };
  }
}

// Función para obtener la ruta de la imagen
function getImagePath(imageName) {
  return path.join(__dirname, 'memes', '1', imageName);
}

// Función para probar la selección de frases e imágenes en el orden deseado
function testMemeSelection() {
  const { frase, imagePath } = getNextMemeAndPhrase();

  if (frase && imagePath) {
    console.log('Frase seleccionada:', frase);
    console.log('Ruta de la imagen seleccionada:', imagePath);
  }

  // Incrementar el contador y guardarlo en el archivo JSON
  incrementarContador();
}

// Ejecutamos la función testMemeSelection
testMemeSelection();
