import axios from 'axios'
import * as cheerio from 'cheerio'

const META_PROPERTIES = [
  'og:title', 'og:description', 'og:image', 'og:url', 'og:type',
  'twitter:card', 'twitter:site', 'twitter:creator', 'twitter:title',
  'twitter:description', 'twitter:image',
  'description', 'title', 'image'
]

export default async function getMetaWithAxios (url) {
  const metadata = { url }

  try {
    const { data } = await axios.get(`https://${url}`)
    const $ = cheerio.load(data)

    META_PROPERTIES.forEach(prop => {
      let value

      // Buscar etiquetas <meta> con atributo 'property' o 'name'
      if (prop.startsWith('og:') || prop.startsWith('twitter:')) {
        // Buscamos las meta etiquetas específicas de redes sociales (Open Graph y Twitter Cards)
        value = $(`meta[property="${prop}"]`).attr('content') || $(`meta[name="${prop}"]`).attr('content')
      } else if (prop === 'description') {
        // Buscamos la meta descripción estándar
        value = $(`meta[name="${prop}"]`).attr('content')
      } else if (prop === 'title') {
        // Buscamos el título principal del documento
        value = $('title').text()
      }

      // Si se encuentra un valor, lo agregamos al objeto de metadatos
      if (value) {
        metadata[prop.replace(':', '_')] = value.trim()
      }
    })
  } catch (error) {
    console.error(`Error al procesar ${url}: ${error.message}`)
    metadata.error = 'No se pudieron obtener los metadatos o la URL no es válida.'
  }

  return metadata
}
