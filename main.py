import json
from urllib.request import urlopen
import pickle
import os

# URL de la API para obtener los memes
url = 'https://tg.i-c-a.su/json/programmerjokes/1?limit=100'
r = urlopen(url)
data = json.loads(r.read().decode("utf-8"))

# Leer la lista de IDs ya descargados
try:
    with open('ids.data', 'rb') as filehandle:
        ids = pickle.load(filehandle)
except FileNotFoundError:
    ids = []

# Ruta del directorio para guardar los memes
directory = 'memes/3/'

# Crear el directorio si no existe
if not os.path.exists(directory):
    os.makedirs(directory)

# Procesar solo el primer meme
message = data['messages'][0]
id = message['id']

# Comprobar si el meme ya está descargado
if int(id) not in ids:
    try:
        # Descargar la imagen del meme
        img_url = 'https://tg.i-c-a.su/media/programmerjokes/' + str(id)
        response = urlopen(img_url)
        with open(os.path.join(directory, str(id) + '.png'), 'wb') as img_file:
            img_file.write(response.read())
        print(str(id) + ': downloaded')

        # Agregar el ID a la lista y actualizar el archivo
        ids.append(int(id))
        with open('ids.data', 'wb') as filehandle:
            pickle.dump(sorted(ids), filehandle)

    except Exception as e:
        print("Error while downloading:", id, "; Error:", e)
else:
    print(str(id) + ': already in the database')
