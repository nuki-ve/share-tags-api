import * as playwright from 'playwright'
import * as cheerio from 'cheerio'

/**
 * Metadata properties to extract from the websites
 */
const META_PROPERTIES = [
  'og:title', 'og:description', 'og:image', 'og:url', 'og:type',
  'twitter:card', 'twitter:site', 'twitter:creator', 'twitter:title',
  'twitter:description', 'twitter:image',
  'description', 'title', 'image'
]

/**
 * Function to extract metadata from a URL
 * @param {string} url - The URL to analyze
 */
export default async function extractMetaTags (url) {
  let browser
  const metadata = { url }

  try {
    browser = await playwright.chromium.launch({ headless: true })
    const context = await browser.newContext({})
    const page = await context.newPage()

    await page.goto(`https://${url}`, { waitUntil: 'domcontentloaded', timeout: 30000 })

    const htmlContent = await page.content()

    const $ = cheerio.load(htmlContent)

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
  } finally {
    // 6. Cerrar el navegador
    if (browser) {
      await browser.close()
    }
  }

  return metadata
}
